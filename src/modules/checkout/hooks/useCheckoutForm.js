import { useState, useEffect, useCallback, useRef } from 'react';
import { useLocationStore, selectActiveBarrio } from '@/store/locationStore';
import { useAuthStore } from '@/store/authStore';
import { useGeolocation } from '@/hooks/useGeolocation';
import { reverseGeocode } from '@/services/map.service';
import { inferBarrioFromGeoLabel, isSpecificBarrio } from '@/utils/barrio';
import { prefillContactFields } from '@/utils/profile-form';
import { pickDefaultDeliveryAddress } from '@/utils/delivery-address';
import { validateCheckoutStep } from '../utils/checkout-validation';

export function useCheckoutForm({ savedAddresses = [], addressesReady = false }) {
  const user = useAuthStore((s) => s.user);
  const profile = useAuthStore((s) => s.profile);
  const municipio = useLocationStore((s) => s.municipio);
  const catalogBarrio = useLocationStore(selectActiveBarrio);
  const homeAddress = useLocationStore((s) => s.address);
  const { latitude, longitude, detect, loading: gpsLoading, hasCoords, locationHint } = useGeolocation();
  const addressPrefillDone = useRef(false);

  const [deliveryBarrio, setDeliveryBarrio] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [reference, setReference] = useState('');
  const [cashChange, setCashChange] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [saveAddress, setSaveAddress] = useState(true);
  const [selectedAddressId, setSelectedAddressId] = useState('');
  const [mapLat, setMapLat] = useState(null);
  const [mapLng, setMapLng] = useState(null);
  const [couponInput, setCouponInput] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [tipAmount, setTipAmount] = useState(0);
  const [fieldErrors, setFieldErrors] = useState({});

  // Nombre y celular del CLIENTE (perfil), no de la tienda del carrito
  useEffect(() => {
    const { fullName: nextName, phone: nextPhone } = prefillContactFields(user, profile, {
      fullName,
      phone,
    });
    if (!fullName && nextName) setFullName(nextName);
    if (!phone && nextPhone) setPhone(nextPhone);
  }, [user, profile, fullName, phone]);

  useEffect(() => {
    if (deliveryBarrio || !isSpecificBarrio(catalogBarrio)) return;
    setDeliveryBarrio(catalogBarrio);
  }, [catalogBarrio, deliveryBarrio]);

  // Esperar a que carguen las direcciones del perfil antes de precargar
  useEffect(() => {
    if (!addressesReady || addressPrefillDone.current || selectedAddressId) return;

    const defaultAddr = pickDefaultDeliveryAddress(savedAddresses)
      || savedAddresses.find((a) => a.is_default)
      || savedAddresses[0];

    if (defaultAddr) {
      addressPrefillDone.current = true;
      setSelectedAddressId(defaultAddr.id);
      setAddress(defaultAddr.address || '');
      setReference(defaultAddr.reference || '');
      if (defaultAddr.barrio) setDeliveryBarrio(defaultAddr.barrio);
      if (defaultAddr.latitude != null) setMapLat(Number(defaultAddr.latitude));
      if (defaultAddr.longitude != null) setMapLng(Number(defaultAddr.longitude));
      return;
    }

    if (homeAddress?.trim()) {
      addressPrefillDone.current = true;
      setSelectedAddressId('new');
      setAddress(homeAddress.trim());
    } else {
      addressPrefillDone.current = true;
    }
  }, [addressesReady, savedAddresses, selectedAddressId, homeAddress]);

  useEffect(() => {
    if (deliveryBarrio || !latitude || !longitude) return;
    let cancelled = false;
    reverseGeocode(latitude, longitude)
      .then((label) => {
        if (cancelled || !label) return;
        const inferred = inferBarrioFromGeoLabel(label, municipio);
        if (inferred) setDeliveryBarrio(inferred);
      })
      .catch(() => {});
    return () => { cancelled = true; };
  }, [latitude, longitude, municipio, deliveryBarrio]);

  const validateStep = useCallback((step, total = 0) => {
    const result = validateCheckoutStep(step, {
      fullName,
      phone,
      address,
      reference,
      barrio: deliveryBarrio,
      municipio,
      mapLat,
      mapLng,
      latitude,
      longitude,
      paymentMethod,
      cashChange,
      total,
    });
    setFieldErrors(result.errors);
    return result;
  }, [fullName, phone, address, reference, deliveryBarrio, municipio, mapLat, mapLng, latitude, longitude, paymentMethod, cashChange]);

  const selectSavedAddress = useCallback((addr) => {
    setSelectedAddressId(addr.id);
    setAddress(addr.address);
    setReference(addr.reference || '');
    if (isSpecificBarrio(addr.barrio)) setDeliveryBarrio(addr.barrio);
    if (addr.latitude != null) setMapLat(Number(addr.latitude));
    if (addr.longitude != null) setMapLng(Number(addr.longitude));
    setFieldErrors((e) => ({ ...e, address: undefined, location: undefined, barrio: undefined }));
  }, []);

  const useNewAddress = useCallback(() => {
    setSelectedAddressId('new');
    setAddress('');
    setReference('');
    setDeliveryBarrio('');
    setMapLat(null);
    setMapLng(null);
  }, []);

  const onMapChange = useCallback(({ latitude: lat, longitude: lng, label }) => {
    setMapLat(lat);
    setMapLng(lng);
    if (label && !address) setAddress(label.split(',')[0] || label);
    const inferred = inferBarrioFromGeoLabel(label, municipio);
    if (inferred) {
      setDeliveryBarrio(inferred);
      setFieldErrors((e) => ({ ...e, barrio: undefined }));
    }
    setFieldErrors((e) => ({ ...e, location: undefined }));
  }, [address, municipio]);

  const onPlaceSelect = useCallback((place) => {
    if (!place) return;
    setMapLat(place.latitude);
    setMapLng(place.longitude);
    if (place.label) setAddress(place.label);
    const inferred = inferBarrioFromGeoLabel(place.label, municipio);
    if (inferred) {
      setDeliveryBarrio(inferred);
      setFieldErrors((e) => ({ ...e, barrio: undefined }));
    }
    setFieldErrors((e) => ({ ...e, address: undefined, location: undefined }));
  }, [municipio]);

  return {
    municipio,
    barrio: deliveryBarrio,
    setBarrio: setDeliveryBarrio,
    fullName,
    setFullName,
    phone,
    setPhone,
    address,
    setAddress,
    reference,
    setReference,
    cashChange,
    setCashChange,
    paymentMethod,
    setPaymentMethod,
    saveAddress,
    setSaveAddress,
    selectedAddressId,
    selectSavedAddress,
    useNewAddress,
    mapLat,
    mapLng,
    onMapChange,
    onPlaceSelect,
    couponInput,
    setCouponInput,
    appliedCoupon,
    setAppliedCoupon,
    tipAmount,
    setTipAmount,
    fieldErrors,
    setFieldErrors,
    validateStep,
    detect,
    gpsLoading,
    hasCoords,
    locationHint,
    latitude,
    longitude,
    deliveryCoords: {
      latitude: mapLat ?? latitude,
      longitude: mapLng ?? longitude,
    },
  };
}
