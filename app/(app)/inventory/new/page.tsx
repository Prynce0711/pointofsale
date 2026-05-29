import AppShell from "@/app/Layout/index";
import ProductForm from "@/app/Pages/Inventory/ProductForm";
import Card from "@/app/Shared/Card/Card";

export default function NewProductPage() {
  return (
    <AppShell title="Add product" subtitle="Create a menu item, add-on, ingredient, or supply.">
      <Card
        title="Product details"
        description="Use separate products for Small, Medium, and Large drink variants when prices or stock differ."
      >
        <ProductForm />
      </Card>
    </AppShell>
  );
}
