const Settings = () => {
  return (
    <div className="container mx-auto py-6 space-y-2">
      <h1 className="text-2xl font-semibold">Settings</h1>
      <p className="text-muted-foreground max-w-2xl">
        Connect your Azure tenant and configure data ingestion, RBAC roles, and alert channels. In production, this will authenticate via Azure AD and call your Functions backend.
      </p>
    </div>
  );
};

export default Settings;
