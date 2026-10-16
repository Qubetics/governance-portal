import DashboardLayout from '../../Common/Layouts/DashboardLayout/DashboardLayout'
function Private() {
  const isAuthenticated = true;
  return isAuthenticated ? <DashboardLayout /> : <></>;
}

export default Private;
