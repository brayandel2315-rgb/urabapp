import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ClientLayout from '../layouts/ClientLayout';
import BusinessLayout from '../layouts/BusinessLayout';
import RiderLayout from '../layouts/RiderLayout';
import AdminLayout from '../layouts/AdminLayout';
import PageLoader from '../components/PageLoader';
import ProtectedRoute from './ProtectedRoute';
import DevOnlyRoute from './DevOnlyRoute';
import RequireOwnAccount from './RequireOwnAccount';
import { ROLES } from '../utils/constants';

import { CLIENT_HOME } from './clientNav';
import ExplorarRedirect from './ExplorarRedirect';

import Login from '../pages/Login';
import NotFound from '../pages/NotFound';

const HomePage = lazy(() => import('../modules/client/pages/HomePage'));
const VerticalDiscoveryPage = lazy(() => import('../modules/discovery/pages/VerticalDiscoveryPage'));
const SearchPage = lazy(() => import('../modules/discovery/pages/SearchPage'));
const BusinessPage = lazy(() => import('../modules/client/pages/BusinessPage'));
const CartPage = lazy(() => import('../modules/client/pages/CartPage'));
const CheckoutPage = lazy(() => import('../modules/client/pages/CheckoutPage'));
const OrdersPage = lazy(() => import('../modules/client/pages/OrdersPage'));
const OrderDetailPage = lazy(() => import('../modules/client/pages/OrderDetailPage'));
const MandadoPage = lazy(() => import('../modules/client/pages/MandadoPage'));
const EnviosPage = lazy(() => import('../modules/client/pages/EnviosPage'));
const ShipmentDetailPage = lazy(() => import('../modules/client/pages/ShipmentDetailPage'));
const AccountLayout = lazy(() => import('../modules/account/AccountLayout'));
const AccountProfilePage = lazy(() => import('../modules/account/pages/AccountProfilePage'));
const AccountAddressesPage = lazy(() => import('../modules/account/pages/AccountAddressesPage'));
const AccountPaymentsPage = lazy(() => import('../modules/account/pages/AccountPaymentsPage'));
const AccountBillingPage = lazy(() => import('../modules/account/pages/AccountBillingPage'));
const AccountHistoryPage = lazy(() => import('../modules/account/pages/AccountHistoryPage'));
const AccountFavoritesPage = lazy(() => import('../modules/account/pages/AccountFavoritesPage'));
const AccountCouponsPage = lazy(() => import('../modules/account/pages/AccountCouponsPage'));
const AccountCreditsPage = lazy(() => import('../modules/account/pages/AccountCreditsPage'));
const AccountMembershipPage = lazy(() => import('../modules/account/pages/AccountMembershipPage'));
const AccountPreferencesPage = lazy(() => import('../modules/account/pages/AccountPreferencesPage'));
const AccountSecurityPage = lazy(() => import('../modules/account/pages/AccountSecurityPage'));
const AccountHelpPage = lazy(() => import('../modules/account/pages/AccountHelpPage'));
const AccountNotificationsPage = lazy(() => import('../modules/account/pages/AccountNotificationsPage'));
const LegalPage = lazy(() => import('../modules/legal/pages/LegalPage'));
const ComoFuncionaPage = lazy(() => import('../modules/info/pages/ComoFuncionaPage'));
const RegistrarComercioPage = lazy(() => import('../modules/info/pages/RegistrarComercioPage'));
const SerDomiciliarioPage = lazy(() => import('../modules/info/pages/SerDomiciliarioPage'));
const FaqPage = lazy(() => import('../modules/info/pages/FaqPage'));
const SeguridadInfoPage = lazy(() => import('../modules/info/pages/SeguridadInfoPage'));
const RecoverAccount = lazy(() => import('../pages/RecoverAccount'));
const SupportPage = lazy(() => import('../modules/client/pages/SupportPage'));
const QuienesSomosPage = lazy(() => import('../modules/client/pages/QuienesSomosPage'));
const OffersPage = lazy(() => import('../modules/client/pages/OffersPage'));

const BusinessDashboard = lazy(() => import('../modules/business/pages/BusinessDashboard'));
const BusinessOnboarding = lazy(() => import('../modules/business/pages/BusinessOnboarding'));
const RiderDashboard = lazy(() => import('../modules/rider/pages/RiderDashboard'));
const RiderOnboarding = lazy(() => import('../modules/rider/pages/RiderOnboarding'));
const RiderEarnings = lazy(() => import('../modules/rider/pages/RiderEarnings'));
const RiderReputation = lazy(() => import('../modules/rider/pages/RiderReputation'));
const RiderAccount = lazy(() => import('../modules/rider/pages/RiderAccount'));
const RiderDelivery = lazy(() => import('../modules/rider/pages/RiderDelivery'));
const RiderSecurity = lazy(() => import('../modules/rider/pages/RiderSecurity'));
const AdminDashboard = lazy(() => import('../modules/admin/pages/AdminDashboard'));

const Brandboard = lazy(() => import('../pages/Brandboard'));
const Informe = lazy(() => import('../pages/Informe'));
const UrabaExpressPrototype = lazy(() => import('../pages/UrabaExpressPrototype'));

const businessDashboardRoles = [ROLES.BUSINESS, ROLES.ADMIN];

function Lazy({ children }) {
  return <Suspense fallback={<PageLoader />}>{children}</Suspense>;
}

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<ClientLayout />}>
        <Route path={CLIENT_HOME} element={<Lazy><HomePage /></Lazy>} />
        <Route path="/explorar" element={<ExplorarRedirect />} />
        <Route path="/restaurantes" element={<Lazy><VerticalDiscoveryPage /></Lazy>} />
        <Route path="/mercado" element={<Lazy><VerticalDiscoveryPage /></Lazy>} />
        <Route path="/farmacia" element={<Lazy><VerticalDiscoveryPage /></Lazy>} />
        <Route path="/mensajeria" element={<Lazy><VerticalDiscoveryPage /></Lazy>} />
        <Route path="/tiendas" element={<Lazy><VerticalDiscoveryPage /></Lazy>} />
        <Route path="/search" element={<Lazy><SearchPage /></Lazy>} />
        <Route path="/business/:id" element={<Lazy><BusinessPage /></Lazy>} />
        <Route path="/tienda/:id" element={<Lazy><BusinessPage /></Lazy>} />
        <Route path="/carrito" element={<Lazy><CartPage /></Lazy>} />
        <Route path="/checkout" element={<ProtectedRoute requireAuth><Lazy><CheckoutPage /></Lazy></ProtectedRoute>} />
        <Route path="/pedidos" element={<Lazy><OrdersPage /></Lazy>} />
        <Route path="/pedidos/:id" element={<Lazy><OrderDetailPage /></Lazy>} />
        <Route path="/mandado" element={<Lazy><MandadoPage /></Lazy>} />
        <Route path="/envios" element={<Lazy><EnviosPage /></Lazy>} />
        <Route path="/envios/:id" element={<Lazy><ShipmentDetailPage /></Lazy>} />
        <Route path="/perfil" element={<Navigate to="/cuenta/perfil" replace />} />
        <Route
          path="/cuenta"
          element={
            <RequireOwnAccount>
              <Lazy>
                <AccountLayout />
              </Lazy>
            </RequireOwnAccount>
          }
        >
          <Route index element={<Navigate to="/cuenta/perfil" replace />} />
          <Route path="perfil" element={<Lazy><AccountProfilePage /></Lazy>} />
          <Route path="notificaciones" element={<Lazy><AccountNotificationsPage /></Lazy>} />
          <Route path="direcciones" element={<Lazy><AccountAddressesPage /></Lazy>} />
          <Route path="pagos" element={<Lazy><AccountPaymentsPage /></Lazy>} />
          <Route path="facturacion" element={<Lazy><AccountBillingPage /></Lazy>} />
          <Route path="historial" element={<Lazy><AccountHistoryPage /></Lazy>} />
          <Route path="favoritos" element={<Lazy><AccountFavoritesPage /></Lazy>} />
          <Route path="cupones" element={<Lazy><AccountCouponsPage /></Lazy>} />
          <Route path="creditos" element={<Lazy><AccountCreditsPage /></Lazy>} />
          <Route path="membresia" element={<Lazy><AccountMembershipPage /></Lazy>} />
          <Route path="preferencias" element={<Lazy><AccountPreferencesPage /></Lazy>} />
          <Route path="seguridad" element={<Lazy><AccountSecurityPage /></Lazy>} />
          <Route path="ayuda" element={<Lazy><AccountHelpPage /></Lazy>} />
        </Route>
        <Route path="/soporte" element={<Lazy><SupportPage /></Lazy>} />
        <Route path="/quienes-somos" element={<Lazy><QuienesSomosPage /></Lazy>} />
        <Route path="/ofertas" element={<Lazy><OffersPage /></Lazy>} />
        <Route path="/recuperar-cuenta" element={<Lazy><RecoverAccount /></Lazy>} />
      </Route>

      <Route path="/login" element={<Login />} />

      <Route path="/legal/:docId" element={<Lazy><LegalPage /></Lazy>} />
      <Route path="/info/como-funciona" element={<Lazy><ComoFuncionaPage /></Lazy>} />
      <Route path="/info/registrar-comercio" element={<Lazy><RegistrarComercioPage /></Lazy>} />
      <Route path="/info/ser-domiciliario" element={<Lazy><SerDomiciliarioPage /></Lazy>} />
      <Route path="/info/faq" element={<Lazy><FaqPage /></Lazy>} />
      <Route path="/info/seguridad" element={<Lazy><SeguridadInfoPage /></Lazy>} />

      <Route path="/brandboard" element={<DevOnlyRoute><Lazy><Brandboard /></Lazy></DevOnlyRoute>} />
      <Route path="/informe" element={<DevOnlyRoute><Lazy><Informe /></Lazy></DevOnlyRoute>} />
      <Route path="/uraba-express" element={<DevOnlyRoute><Lazy><UrabaExpressPrototype /></Lazy></DevOnlyRoute>} />

      {/* Onboarding público — crear cuenta en la misma página */}
      <Route path="/negocio/onboarding" element={<BusinessLayout />}>
        <Route index element={<Lazy><BusinessOnboarding /></Lazy>} />
      </Route>

      <Route
        path="/negocio"
        element={
          <ProtectedRoute roles={businessDashboardRoles} requireAuth>
            <BusinessLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Lazy><BusinessDashboard /></Lazy>} />
      </Route>

      <Route path="/domiciliario/registro" element={<RiderLayout />}>
        <Route index element={<Lazy><RiderOnboarding /></Lazy>} />
      </Route>

      <Route
        path="/domiciliario"
        element={
          <ProtectedRoute roles={[ROLES.RIDER, ROLES.ADMIN]} requireAuth>
            <RiderLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Lazy><RiderDashboard /></Lazy>} />
        <Route path="ganancias" element={<Lazy><RiderEarnings /></Lazy>} />
        <Route path="reputacion" element={<Lazy><RiderReputation /></Lazy>} />
        <Route path="cuenta" element={<Lazy><RiderAccount /></Lazy>} />
        <Route path="perfil" element={<Navigate to="/domiciliario/cuenta" replace />} />
        <Route path="seguridad" element={<Lazy><RiderSecurity /></Lazy>} />
        <Route path="entrega/:orderId" element={<Lazy><RiderDelivery /></Lazy>} />
      </Route>

      <Route
        path="/admin"
        element={
          <ProtectedRoute roles={[ROLES.ADMIN]} requireAuth>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Lazy><AdminDashboard /></Lazy>} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
