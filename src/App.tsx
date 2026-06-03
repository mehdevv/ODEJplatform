import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/lib/auth";
import { RequireAuth } from "@/components/auth/RequireAuth";
import { RequireAdmin } from "@/components/auth/RequireAdmin";
import { RequireClub } from "@/components/auth/RequireClub";

import Home from "@/pages/home";
import AuthHub from "@/pages/auth/index";
import Login from "@/pages/auth/login";
import LoginYouth from "@/pages/auth/login-youth";
import LoginClub from "@/pages/auth/login-club";
import LoginAdmin from "@/pages/auth/login-admin";
import AdminPortalEntry from "@/pages/portal/index";
import Register from "@/pages/auth/register";
import RegisterYouth from "@/pages/auth/register-youth";
import RegisterClub from "@/pages/auth/register-club";
import ForgotPassword from "@/pages/auth/forgot-password";
import VerifyEmail from "@/pages/auth/verify-email";
import ResetPassword from "@/pages/auth/reset-password";
import InstitutionsDirectory from "@/pages/institutions/index";
import InstitutionDetail from "@/pages/institutions/[slug]";
import NewsHub from "@/pages/news/index";
import ArticleDetail from "@/pages/news/[slug]";
import EventsActivities from "@/pages/events/index";
import EventDetail from "@/pages/events/[slug]";
import Khilya from "@/pages/khilya";
import Diwan from "@/pages/diwan";
import Partnerships from "@/pages/partenariats";
import About from "@/pages/about";
import Contact from "@/pages/contact";
import SearchResults from "@/pages/search";
import Dashboard from "@/pages/dashboard/index";
import Profile from "@/pages/dashboard/profile";
import Bookings from "@/pages/dashboard/bookings";
import DashboardTraining from "@/pages/dashboard/training";
import TrainingCatalog from "@/pages/training/index";
import TrainingDetail from "@/pages/training/[slug]";
import ClubDashboard from "@/pages/club/index";
import ClubProfile from "@/pages/club/profile";
import ClubProgramsList from "@/pages/club/programs/index";
import ClubProgramEditor from "@/pages/club/programs/editor";
import AdminTrainingPrograms from "@/pages/admin/training/index";
import AdminTrainingReview from "@/pages/admin/training/review";
import AdminDashboard from "@/pages/admin/index";
import AdminNews from "@/pages/admin/news/index";
import ArticleEditor from "@/pages/admin/news/editor";
import AdminEvents from "@/pages/admin/events/index";
import EventEditor from "@/pages/admin/events/editor";
import AdminInstitutions from "@/pages/admin/institutions/index";
import AdminUsers from "@/pages/admin/users/index";
import AdminKhilya from "@/pages/admin/khilya/index";
import AdminPartnerships from "@/pages/admin/partnerships/index";
import AdminDiwan from "@/pages/admin/diwan/index";
import AdminMedia from "@/pages/admin/media/index";
import AdminSettings from "@/pages/admin/settings/index";
import CounsellorPortal from "@/pages/admin/khilya/counsellor";
import NotFound from "@/pages/not-found";
import { useLocaleLocation } from "@/components/routing/LocaleRouter";
import { WilayaProvider } from "@/contexts/WilayaContext";
import { AnimatedRoutes } from "@/components/routing/AnimatedRoutes";

const queryClient = new QueryClient();

const withAuth = (C: React.ComponentType) => () => (
  <RequireAuth>
    <C />
  </RequireAuth>
);

const withAdmin = (C: React.ComponentType) => () => (
  <RequireAdmin>
    <C />
  </RequireAdmin>
);

const withClub = (C: React.ComponentType) => () => (
  <RequireClub>
    <C />
  </RequireClub>
);

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/auth" component={AuthHub} />
      <Route path="/auth/login" component={Login} />
      <Route path="/auth/login/youth" component={LoginYouth} />
      <Route path="/auth/login/club" component={LoginClub} />
      <Route path="/auth/login/admin" component={LoginAdmin} />
      <Route path="/portal" component={AdminPortalEntry} />
      <Route path="/auth/register" component={Register} />
      <Route path="/auth/register/youth" component={RegisterYouth} />
      <Route path="/auth/register/club" component={RegisterClub} />
      <Route path="/auth/forgot-password" component={ForgotPassword} />
      <Route path="/auth/verify-email" component={VerifyEmail} />
      <Route path="/auth/reset-password" component={ResetPassword} />

      <Route path="/institutions" component={InstitutionsDirectory} />
      <Route path="/institutions/:slug" component={InstitutionDetail} />

      <Route path="/actualites" component={NewsHub} />
      <Route path="/actualites/:slug" component={ArticleDetail} />

      <Route path="/activites" component={EventsActivities} />
      <Route path="/activites/:slug" component={EventDetail} />

      <Route path="/formation" component={TrainingCatalog} />
      <Route path="/formation/:slug" component={TrainingDetail} />

      <Route path="/khilya" component={Khilya} />
      <Route path="/diwan" component={Diwan} />
      <Route path="/partenariats" component={Partnerships} />
      <Route path="/a-propos" component={About} />
      <Route path="/contact" component={Contact} />
      <Route path="/search" component={SearchResults} />

      <Route path="/dashboard" component={withAuth(Dashboard)} />
      <Route path="/dashboard/profile" component={withAuth(Profile)} />
      <Route path="/dashboard/bookings" component={withAuth(Bookings)} />
      <Route path="/dashboard/training" component={withAuth(DashboardTraining)} />

      <Route path="/club" component={withClub(ClubDashboard)} />
      <Route path="/club/profile" component={withClub(ClubProfile)} />
      <Route path="/club/programs" component={withClub(ClubProgramsList)} />
      <Route path="/club/programs/new" component={withClub(ClubProgramEditor)} />
      <Route path="/club/programs/:id/edit" component={withClub(ClubProgramEditor)} />

      <Route path="/admin" component={withAdmin(AdminDashboard)} />
      <Route path="/admin/news" component={withAdmin(AdminNews)} />
      <Route path="/admin/news/new" component={withAdmin(ArticleEditor)} />
      <Route path="/admin/news/:id/edit" component={withAdmin(ArticleEditor)} />

      <Route path="/admin/events" component={withAdmin(AdminEvents)} />
      <Route path="/admin/events/new" component={withAdmin(EventEditor)} />
      <Route path="/admin/events/:id/edit" component={withAdmin(EventEditor)} />

      <Route path="/admin/institutions" component={withAdmin(AdminInstitutions)} />
      <Route path="/admin/users" component={withAdmin(AdminUsers)} />
      <Route path="/admin/training-programs" component={withAdmin(AdminTrainingPrograms)} />
      <Route path="/admin/training-programs/:id" component={withAdmin(AdminTrainingReview)} />
      <Route path="/admin/khilya" component={withAdmin(AdminKhilya)} />
      <Route path="/admin/partnerships" component={withAdmin(AdminPartnerships)} />
      <Route path="/admin/diwan" component={withAdmin(AdminDiwan)} />
      <Route path="/admin/media" component={withAdmin(AdminMedia)} />
      <Route path="/admin/settings" component={withAdmin(AdminSettings)} />
      <Route path="/admin/khilya/counsellor" component={CounsellorPortal} />

      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <WilayaProvider>
            <WouterRouter
              hook={useLocaleLocation}
              base={import.meta.env.BASE_URL.replace(/\/$/, "")}
            >
              <AnimatedRoutes>
                <Router />
              </AnimatedRoutes>
            </WouterRouter>
          </WilayaProvider>
          <Toaster />
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
