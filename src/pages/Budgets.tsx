const Budgets = () => {
  return (
    <div className="container mx-auto py-6 space-y-2">
      <h1 className="text-2xl font-semibold">Budgets</h1>
      <p className="text-muted-foreground max-w-2xl">
        Integrate Azure Budgets to enforce spend thresholds and trigger proactive alerts. This UI will surface budget status and alerts per subscription/resource group.
      </p>
    </div>
  );
};

export default Budgets;
