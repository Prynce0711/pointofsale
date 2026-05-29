// "use client";

// import { useMemo, useState, useTransition } from "react";
// import { AnimatePresence, motion } from "framer-motion";
// import { completeSaleAction, type CheckoutResult } from "@/app/actions/sales";
// import { formatCurrency } from "@/app/lib/format";
// import {
//   ORDER_TYPES,
//   TEMPERATURE_OPTIONS,
//   isDrinkCategory,
//   orderTypeLabels,
//   productCategoryLabels,
//   productSizeLabels,
//   temperatureLabels,
//   type OrderTypeValue,
//   type ProductCategoryValue,
//   type ProductSizeValue,
//   type TemperatureValue,
// } from "@/app/lib/labels";
// import {
//   AnimatedButton,
//   AnimatedItem,
//   AnimatedList,
// } from "@/app/Shared/Motion/Motion";

// export type POSProduct = {
//   id: number;
//   name: string;
//   category: ProductCategoryValue;
//   size: ProductSizeValue;
//   sku: string;
//   priceCents: number;
//   stock: number;
// };

// type CartItem = POSProduct & {
//   cartId: string;
//   quantity: number;
//   temperature: TemperatureValue;
//   addOnIds: number[];
// };

// type POSClientProps = {
//   products: POSProduct[];
//   addOns: POSProduct[];
// };

// export default function POSClient({ products, addOns }: POSClientProps) {
//   const [query, setQuery] = useState("");
//   const [category, setCategory] = useState("ALL");
//   const [cart, setCart] = useState<CartItem[]>([]);
//   const [orderType, setOrderType] = useState<OrderTypeValue>("DINE_IN");
//   const [amountPaid, setAmountPaid] = useState("");
//   const [result, setResult] = useState<CheckoutResult | null>(null);
//   const [showReceiptModal, setShowReceiptModal] = useState(false);
//   const [isPending, startTransition] = useTransition();

//   const categories = useMemo(
//     () => ["ALL", ...new Set(products.map((product) => product.category))],
//     [products],
//   );

//   const filteredProducts = products.filter((product) => {
//     const q = query.trim().toLowerCase();
//     const matchesQuery =
//       q === "" ||
//       product.name.toLowerCase().includes(q) ||
//       product.sku.toLowerCase().includes(q);
//     const matchesCategory = category === "ALL" || product.category === category;

//     return matchesQuery && matchesCategory;
//   });

//   const addOnMap = new Map(addOns.map((addOn) => [addOn.id, addOn]));
//   const subtotalCents = cart.reduce(
//     (total, item) => total + getLineTotal(item, addOnMap),
//     0,
//   );
//   const paidCents = Math.round((Number(amountPaid) || 0) * 100);
//   const changeCents = Math.max(0, paidCents - subtotalCents);

//   function addToCart(product: POSProduct) {
//     setResult(null);
//     setShowReceiptModal(false);
//     setCart((current) => [
//       ...current,
//       {
//         ...product,
//         cartId: createCartId(),
//         quantity: 1,
//         temperature: isDrinkCategory(product.category)
//           ? "ICED"
//           : "NOT_APPLICABLE",
//         addOnIds: [],
//       },
//     ]);
//   }

//   function updateQuantity(cartId: string, quantity: number) {
//     setCart((current) =>
//       current.map((item) =>
//         item.cartId === cartId
//           ? { ...item, quantity: Math.max(1, Math.min(999, quantity)) }
//           : item,
//       ),
//     );
//   }

//   function toggleAddOn(cartId: string, addOnId: number) {
//     setCart((current) =>
//       current.map((item) => {
//         if (item.cartId !== cartId) return item;

//         const hasAddOn = item.addOnIds.includes(addOnId);
//         return {
//           ...item,
//           addOnIds: hasAddOn
//             ? item.addOnIds.filter((id) => id !== addOnId)
//             : [...item.addOnIds, addOnId],
//         };
//       }),
//     );
//   }

//   function updateTemperature(cartId: string, temperature: TemperatureValue) {
//     setCart((current) =>
//       current.map((item) =>
//         item.cartId === cartId ? { ...item, temperature } : item,
//       ),
//     );
//   }

//   function removeItem(cartId: string) {
//     setCart((current) => current.filter((item) => item.cartId !== cartId));
//   }

//   function completeSale() {
//     setResult(null);
//     startTransition(async () => {
//       const response = await completeSaleAction({
//         orderType,
//         amountPaidCents: paidCents,
//         items: cart.map((item) => ({
//           productId: item.id,
//           quantity: item.quantity,
//           temperature: item.temperature,
//           addOnIds: item.addOnIds,
//         })),
//       });

//       setResult(response);

//       if (response.ok) {
//         setCart([]);
//         setAmountPaid("");
//         setShowReceiptModal(true);
//       }
//     });
//   }

//   return (
//     // <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_430px]">
//     //   <section className="grid gap-4">
//     //     <motion.div
//     //       initial={{ opacity: 0, y: 12 }}
//     //       animate={{ opacity: 1, y: 0 }}
//     //       transition={{ duration: 0.28, ease: "easeOut" }}
//     //       className="grid items-center gap-3 rounded-3xl border border-[#ead8c5] bg-[#fffaf3]/90 p-3 shadow-[var(--shadow-card)] md:grid-cols-[minmax(0,1fr)_auto]"
//     //     >
//     //       <input
//     //         value={query}
//     //         onChange={(event) => setQuery(event.target.value)}
//     //         placeholder="Search drinks, pastries, SKU"
//     //         className="coffee-focus h-12 rounded-2xl border border-[#d8bf9f] bg-white/85 px-4 text-sm text-[#2c1810]"
//     //       />
//     //       <div className="flex items-center gap-2 overflow-x-auto">
//     //         {categories.map((item) => (
//     //           <AnimatedButton
//     //             key={item}
//     //             type="button"
//     //             onClick={() => setCategory(item)}
//     //             className={`h-12 whitespace-nowrap rounded-2xl px-4 text-sm font-semibold ${
//     //               category === item
//     //                 ? "bg-[#8B5A35] text-white shadow-sm shadow-[#8B5A35]/20"
//     //                 : "border border-[#d8bf9f] bg-white/70 text-[#4b2f22] hover:bg-[#fff8ef]"
//     //             }`}
//     //           >
//     //             {item === "ALL"
//     //               ? "All"
//     //               : productCategoryLabels[item as ProductCategoryValue]}
//     //           </AnimatedButton>
//     //         ))}
//     //       </div>
//     //     </motion.div>

//     //     {filteredProducts.length === 0 ? (
//     //       <p className="rounded-3xl border border-dashed border-[#d8bf9f] bg-[#fff8ef] px-4 py-12 text-center text-sm text-[#8a6b58]">
//     //         No matching menu items.
//     //       </p>
//     //     ) : (
//     //       <AnimatedList className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
//     //         {filteredProducts.map((product) => (
//     //           <AnimatedItem key={product.id}>
//     //             <article className="grid min-h-48 gap-3 rounded-3xl border border-[#ead8c5] bg-[#fffaf3] p-4 shadow-[var(--shadow-card)] transition hover:border-[#d8bf9f]">
//     //               <div>
//     //                 <div className="flex items-start justify-between gap-3">
//     //                   <h3 className="font-semibold text-[#2c1810]">
//     //                     {product.name}
//     //                   </h3>
//     //                   <span className="rounded-full bg-[#f3e6d5] px-2 py-1 text-xs font-semibold text-[#6f4b35]">
//     //                     {formatCurrency(product.priceCents)}
//     //                   </span>
//     //                 </div>
//     //                 <p className="mt-1 text-xs text-[#8a6b58]">
//     //                   {productCategoryLabels[product.category]} /{" "}
//     //                   {productSizeLabels[product.size]}
//     //                 </p>
//     //               </div>
//     //               <div className="mt-auto flex items-center justify-between gap-3">
//     //                 <span
//     //                   className={`rounded-full px-2 py-1 text-xs font-semibold ${
//     //                     product.stock <= 0
//     //                       ? "bg-rose-50 text-rose-700"
//     //                       : "bg-[#efe4d2] text-[#6f4b35]"
//     //                   }`}
//     //                 >
//     //                   Stock: {product.stock}
//     //                 </span>
//     //                 <AnimatedButton
//     //                   type="button"
//     //                   disabled={product.stock <= 0}
//     //                   onClick={() => addToCart(product)}
//     //                   className="rounded-2xl bg-[#7a4b2c] px-3 py-2 text-sm font-semibold text-white shadow-sm shadow-[#7a4b2c]/20 hover:bg-[#61361f] disabled:cursor-not-allowed disabled:bg-[#d9c3aa]"
//     //                 >
//     //                   Add
//     //                 </AnimatedButton>
//     //               </div>
//     //             </article>
//     //           </AnimatedItem>
//     //         ))}
//     //       </AnimatedList>
//     //     )}
//     //   </section>

//     //   <aside className="grid gap-4 rounded-3xl border border-[#ead8c5] bg-[#fffaf3] p-4 shadow-[var(--shadow-soft)] xl:sticky xl:top-4 xl:self-start">
//     //     <div className="border-b border-dashed border-[#d8bf9f] pb-3">
//     //       <h2 className="text-lg font-semibold text-[#2c1810]">Receipt</h2>
//     //       <div className="mt-3 grid grid-cols-2 gap-2">
//     //         {ORDER_TYPES.map((type) => (
//     //           <AnimatedButton
//     //             key={type}
//     //             type="button"
//     //             onClick={() => setOrderType(type)}
//     //             className={`rounded-2xl px-3 py-2 text-sm font-semibold ${
//     //               orderType === type
//     //                 ? "bg-[#2c1810] text-white"
//     //                 : "border border-[#d8bf9f] bg-white/70 text-[#4b2f22]"
//     //             }`}
//     //           >
//     //             {orderTypeLabels[type]}
//     //           </AnimatedButton>
//     //         ))}
//     //       </div>
//     //     </div>

//     //     <div className="grid max-h-[540px] gap-3 overflow-y-auto pr-1">
//     //       {cart.length === 0 ? (
//     //         <p className="rounded-3xl border border-dashed border-[#d8bf9f] bg-[#fff8ef] px-4 py-10 text-center text-sm text-[#8a6b58]">
//     //           Cart is empty.
//     //         </p>
//     //       ) : (
//     //         <AnimatePresence initial={false}>
//     //           {cart.map((item) => (
//     //             <motion.div
//     //               key={item.cartId}
//     //               layout
//     //               initial={{ opacity: 0, x: 18, scale: 0.98 }}
//     //               animate={{ opacity: 1, x: 0, scale: 1 }}
//     //               exit={{ opacity: 0, x: 18, scale: 0.98 }}
//     //               transition={{ duration: 0.2, ease: "easeOut" }}
//     //               className="rounded-3xl border border-[#ead8c5] bg-white/65 p-3"
//     //             >
//     //               <div className="flex items-start justify-between gap-3">
//     //                 <div>
//     //                   <h3 className="text-sm font-semibold text-[#2c1810]">
//     //                     {item.name}
//     //                   </h3>
//     //                   <p className="text-xs text-[#8a6b58]">
//     //                     {item.sku} / {productSizeLabels[item.size]}
//     //                   </p>
//     //                 </div>
//     //                 <AnimatedButton
//     //                   type="button"
//     //                   onClick={() => removeItem(item.cartId)}
//     //                   className="text-sm font-semibold text-rose-600"
//     //                 >
//     //                   Remove
//     //                 </AnimatedButton>
//     //               </div>

//     //               <div className="mt-3 grid gap-2">
//     //                 {isDrinkCategory(item.category) ? (
//     //                   <select
//     //                     value={item.temperature}
//     //                     onChange={(event) =>
//     //                       updateTemperature(
//     //                         item.cartId,
//     //                         event.target.value as TemperatureValue,
//     //                       )
//     //                     }
//     //                     className="coffee-focus rounded-2xl border border-[#d8bf9f] bg-white px-3 py-2 text-sm text-[#2c1810]"
//     //                   >
//     //                     {TEMPERATURE_OPTIONS.filter(
//     //                       (temperature) => temperature !== "NOT_APPLICABLE",
//     //                     ).map((temperature) => (
//     //                       <option key={temperature} value={temperature}>
//     //                         {temperatureLabels[temperature]}
//     //                       </option>
//     //                     ))}
//     //                   </select>
//     //                 ) : null}

//     //                 {addOns.length > 0 ? (
//     //                   <div className="grid gap-1 rounded-2xl bg-[#fff8ef] p-2">
//     //                     {addOns.map((addOn) => (
//     //                       <label
//     //                         key={addOn.id}
//     //                         className="flex items-center justify-between gap-2 text-xs text-[#4b2f22]"
//     //                       >
//     //                         <span className="flex items-center gap-2">
//     //                           <input
//     //                             type="checkbox"
//     //                             checked={item.addOnIds.includes(addOn.id)}
//     //                             onChange={() => toggleAddOn(item.cartId, addOn.id)}
//     //                             className="size-4 rounded border-[#d8bf9f]"
//     //                           />
//     //                           {addOn.name}
//     //                         </span>
//     //                         <span>{formatCurrency(addOn.priceCents)}</span>
//     //                       </label>
//     //                     ))}
//     //                   </div>
//     //                 ) : null}

//     //                 <div className="flex items-center justify-between gap-3">
//     //                   <input
//     //                     type="number"
//     //                     min="1"
//     //                     value={item.quantity}
//     //                     onChange={(event) =>
//     //                       updateQuantity(item.cartId, Number(event.target.value))
//     //                     }
//     //                     className="coffee-focus w-24 rounded-2xl border border-[#d8bf9f] bg-white px-3 py-2 text-sm text-[#2c1810]"
//     //                   />
//     //                   <span className="text-sm font-semibold text-[#2c1810]">
//     //                     {formatCurrency(getLineTotal(item, addOnMap))}
//     //                   </span>
//     //                 </div>
//     //               </div>
//     //             </motion.div>
//     //           ))}
//     //         </AnimatePresence>
//     //       )}
//     //     </div>

//     //     <div className="grid gap-2 border-t border-dashed border-[#d8bf9f] pt-3 text-sm text-[#4b2f22]">
//     //       <div className="flex justify-between">
//     //         <span>Subtotal</span>
//     //         <span>{formatCurrency(subtotalCents)}</span>
//     //       </div>
//     //       <div className="flex justify-between text-base font-semibold text-[#2c1810]">
//     //         <span>Total</span>
//     //         <span>{formatCurrency(subtotalCents)}</span>
//     //       </div>
//     //       <label className="grid gap-1 text-sm font-medium text-[#4b2f22]">
//     //         Cash received
//     //         <input
//     //           type="number"
//     //           min="0"
//     //           step="0.01"
//     //           value={amountPaid}
//     //           onChange={(event) => setAmountPaid(event.target.value)}
//     //           className="coffee-focus rounded-2xl border border-[#d8bf9f] bg-white px-3 py-2 text-[#2c1810]"
//     //         />
//     //       </label>
//     //       <div className="flex justify-between font-semibold text-[#3e621d]">
//     //         <span>Change</span>
//     //         <span>{formatCurrency(changeCents)}</span>
//     //       </div>
//     //       {result ? (
//     //         <div
//     //           className={`rounded-2xl px-3 py-2 text-sm ${
//     //             result.ok
//     //               ? "border border-[#cfdfb0] bg-[#f1f7e8] text-[#3e621d]"
//     //               : "border border-rose-200 bg-rose-50 text-rose-800"
//     //           }`}
//     //         >
//     //           {result.message}
//     //           {result.receiptNo ? (
//     //             <span className="block font-semibold">{result.receiptNo}</span>
//     //           ) : null}
//     //         </div>
//     //       ) : null}
//     //       <AnimatedButton
//     //         type="button"
//     //         disabled={cart.length === 0 || isPending}
//     //         onClick={completeSale}
//     //         className="rounded-2xl bg-[#2c1810] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#4b2f22] disabled:cursor-not-allowed disabled:bg-[#d9c3aa]"
//     //       >
//     //         {isPending ? "Completing..." : "Complete sale"}
//     //       </AnimatedButton>
//     //     </div>
//     //   </aside>

//     //   <AnimatePresence>
//     //     {showReceiptModal && result?.ok ? (
//     //       <motion.div
//     //         className="fixed inset-0 z-50 grid place-items-center bg-[#2c1810]/45 px-4 backdrop-blur-sm"
//     //         initial={{ opacity: 0 }}
//     //         animate={{ opacity: 1 }}
//     //         exit={{ opacity: 0 }}
//     //       >
//     //         <motion.div
//     //           initial={{ opacity: 0, y: 24, scale: 0.96 }}
//     //           animate={{ opacity: 1, y: 0, scale: 1 }}
//     //           exit={{ opacity: 0, y: 18, scale: 0.96 }}
//     //           transition={{ duration: 0.22, ease: "easeOut" }}
//     //           className="w-full max-w-sm rounded-3xl border border-[#ead8c5] bg-[#fffaf3] p-5 shadow-[var(--shadow-soft)]"
//     //         >
//     //           <p className="text-sm font-semibold uppercase tracking-wide text-[#c9823a]">
//     //             Checkout complete
//     //           </p>
//     //           <h3 className="mt-2 text-2xl font-semibold text-[#2c1810]">
//     //             {result.receiptNo}
//     //           </h3>
//     //           <div className="mt-4 rounded-2xl bg-white/70 p-4 text-sm text-[#4b2f22]">
//     //             <div className="flex justify-between">
//     //               <span>Total</span>
//     //               <span>{formatCurrency(result.totalCents ?? 0)}</span>
//     //             </div>
//     //             <div className="mt-2 flex justify-between font-semibold text-[#3e621d]">
//     //               <span>Change</span>
//     //               <span>{formatCurrency(result.changeCents ?? 0)}</span>
//     //             </div>
//     //           </div>
//     //           <AnimatedButton
//     //             type="button"
//     //             onClick={() => setShowReceiptModal(false)}
//     //             className="mt-4 w-full rounded-2xl bg-[#7a4b2c] px-4 py-3 text-sm font-semibold text-white"
//     //           >
//     //             Close receipt
//     //           </AnimatedButton>
//     //         </motion.div>
//     //       </motion.div>
//     //     ) : null}
//     //   </AnimatePresence>
//     // </div>

//     <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_430px]">
//       <section className="grid gap-4">
//         <motion.div
//           initial={{ opacity: 0, y: 12 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.28, ease: "easeOut" }}
//           className="flex items-center gap-2 rounded-2xl border border-[#ead8c5] bg-[#fffaf3]/90 px-3 py-2 shadow-[var(--shadow-card)]"
//         >
//           {/* Search icon */}
//           <svg
//             className="size-4 shrink-0 text-[#a07850]"
//             fill="none"
//             stroke="currentColor"
//             strokeWidth={2}
//             viewBox="0 0 24 24"
//           >
//             <circle cx="11" cy="11" r="8" />
//             <path d="m21 21-4.35-4.35" />
//           </svg>

//           {/* Input */}
//           <input
//             value={query}
//             onChange={(event) => setQuery(event.target.value)}
//             placeholder="Search drinks, pastries, SKU…"
//             className="min-w-0 flex-1 bg-transparent text-sm text-[#2c1810] outline-none placeholder:text-[#b89a7a]"
//           />

//           {/* Divider */}
//           <div className="h-5 w-px shrink-0 bg-[#d8bf9f]" />

//           {/* Category filters */}
//           <div className="flex items-center gap-1.5 overflow-x-auto">
//             {categories.map((item) => (
//               <AnimatedButton
//                 key={item}
//                 type="button"
//                 onClick={() => setCategory(item)}
//                 className={`whitespace-nowrap rounded-xl px-3 py-1.5 text-xs font-semibold transition ${
//                   category === item
//                     ? "bg-[#8B5A35] text-white shadow-sm shadow-[#8B5A35]/20"
//                     : "border border-[#d8bf9f] bg-white/70 text-[#4b2f22] hover:bg-[#fff8ef]"
//                 }`}
//               >
//                 {item === "ALL"
//                   ? "All"
//                   : productCategoryLabels[item as ProductCategoryValue]}
//               </AnimatedButton>
//             ))}
//           </div>
//         </motion.div>

//         {filteredProducts.length === 0 ? (
//           <p className="rounded-3xl border border-dashed border-[#d8bf9f] bg-[#fff8ef] px-4 py-12 text-center text-sm text-[#8a6b58]">
//             No matching menu items.
//           </p>
//         ) : (
//           <AnimatedList className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
//             {filteredProducts.map((product) => (
//               <AnimatedItem key={product.id}>
//                 <article className="grid min-h-48 gap-3 rounded-3xl border border-[#ead8c5] bg-[#fffaf3] p-4 shadow-[var(--shadow-card)] transition hover:border-[#d8bf9f]">
//                   <div>
//                     <div className="flex items-start justify-between gap-3">
//                       <h3 className="font-semibold text-[#2c1810]">
//                         {product.name}
//                       </h3>
//                       <span className="rounded-full bg-[#f3e6d5] px-2 py-1 text-xs font-semibold text-[#6f4b35]">
//                         {formatCurrency(product.priceCents)}
//                       </span>
//                     </div>
//                     <p className="mt-1 text-xs text-[#8a6b58]">
//                       {productCategoryLabels[product.category]} /{" "}
//                       {productSizeLabels[product.size]}
//                     </p>
//                   </div>
//                   <div className="mt-auto flex items-center justify-between gap-3">
//                     <span
//                       className={`rounded-full px-2 py-1 text-xs font-semibold ${
//                         product.stock <= 0
//                           ? "bg-rose-50 text-rose-700"
//                           : "bg-[#efe4d2] text-[#6f4b35]"
//                       }`}
//                     >
//                       Stock: {product.stock}
//                     </span>
//                     <AnimatedButton
//                       type="button"
//                       disabled={product.stock <= 0}
//                       onClick={() => addToCart(product)}
//                       className="rounded-2xl bg-[#7a4b2c] px-3 py-2 text-sm font-semibold text-white shadow-sm shadow-[#7a4b2c]/20 hover:bg-[#61361f] disabled:cursor-not-allowed disabled:bg-[#d9c3aa]"
//                     >
//                       Add
//                     </AnimatedButton>
//                   </div>
//                 </article>
//               </AnimatedItem>
//             ))}
//           </AnimatedList>
//         )}
//       </section>

//       <aside className="grid gap-4 rounded-3xl border border-[#ead8c5] bg-[#fffaf3] p-4 shadow-[var(--shadow-soft)] xl:sticky xl:top-4 xl:self-start">
//         <div className="border-b border-dashed border-[#d8bf9f] pb-3">
//           <h2 className="text-lg font-semibold text-[#2c1810]">Receipt</h2>
//           <div className="mt-3 grid grid-cols-2 gap-2">
//             {ORDER_TYPES.map((type) => (
//               <AnimatedButton
//                 key={type}
//                 type="button"
//                 onClick={() => setOrderType(type)}
//                 className={`rounded-2xl px-3 py-2 text-sm font-semibold ${
//                   orderType === type
//                     ? "bg-[#2c1810] text-white"
//                     : "border border-[#d8bf9f] bg-white/70 text-[#4b2f22]"
//                 }`}
//               >
//                 {orderTypeLabels[type]}
//               </AnimatedButton>
//             ))}
//           </div>
//         </div>

//         <div className="grid max-h-[540px] gap-3 overflow-y-auto pr-1">
//           {cart.length === 0 ? (
//             <p className="rounded-3xl border border-dashed border-[#d8bf9f] bg-[#fff8ef] px-4 py-10 text-center text-sm text-[#8a6b58]">
//               Cart is empty.
//             </p>
//           ) : (
//             <AnimatePresence initial={false}>
//               {cart.map((item) => (
//                 <motion.div
//                   key={item.cartId}
//                   layout
//                   initial={{ opacity: 0, x: 18, scale: 0.98 }}
//                   animate={{ opacity: 1, x: 0, scale: 1 }}
//                   exit={{ opacity: 0, x: 18, scale: 0.98 }}
//                   transition={{ duration: 0.2, ease: "easeOut" }}
//                   className="rounded-3xl border border-[#ead8c5] bg-white/65 p-3"
//                 >
//                   <div className="flex items-start justify-between gap-3">
//                     <div>
//                       <h3 className="text-sm font-semibold text-[#2c1810]">
//                         {item.name}
//                       </h3>
//                       <p className="text-xs text-[#8a6b58]">
//                         {item.sku} / {productSizeLabels[item.size]}
//                       </p>
//                     </div>
//                     <AnimatedButton
//                       type="button"
//                       onClick={() => removeItem(item.cartId)}
//                       className="text-sm font-semibold text-rose-600"
//                     >
//                       Remove
//                     </AnimatedButton>
//                   </div>

//                   <div className="mt-3 grid gap-2">
//                     {isDrinkCategory(item.category) ? (
//                       <select
//                         value={item.temperature}
//                         onChange={(event) =>
//                           updateTemperature(
//                             item.cartId,
//                             event.target.value as TemperatureValue,
//                           )
//                         }
//                         className="coffee-focus rounded-2xl border border-[#d8bf9f] bg-white px-3 py-2 text-sm text-[#2c1810]"
//                       >
//                         {TEMPERATURE_OPTIONS.filter(
//                           (temperature) => temperature !== "NOT_APPLICABLE",
//                         ).map((temperature) => (
//                           <option key={temperature} value={temperature}>
//                             {temperatureLabels[temperature]}
//                           </option>
//                         ))}
//                       </select>
//                     ) : null}

//                     {addOns.length > 0 ? (
//                       <div className="grid gap-1 rounded-2xl bg-[#fff8ef] p-2">
//                         {addOns.map((addOn) => (
//                           <label
//                             key={addOn.id}
//                             className="flex items-center justify-between gap-2 text-xs text-[#4b2f22]"
//                           >
//                             <span className="flex items-center gap-2">
//                               <input
//                                 type="checkbox"
//                                 checked={item.addOnIds.includes(addOn.id)}
//                                 onChange={() =>
//                                   toggleAddOn(item.cartId, addOn.id)
//                                 }
//                                 className="size-4 rounded border-[#d8bf9f]"
//                               />
//                               {addOn.name}
//                             </span>
//                             <span>{formatCurrency(addOn.priceCents)}</span>
//                           </label>
//                         ))}
//                       </div>
//                     ) : null}

//                     <div className="flex items-center justify-between gap-3">
//                       <input
//                         type="number"
//                         min="1"
//                         value={item.quantity}
//                         onChange={(event) =>
//                           updateQuantity(
//                             item.cartId,
//                             Number(event.target.value),
//                           )
//                         }
//                         className="coffee-focus w-24 rounded-2xl border border-[#d8bf9f] bg-white px-3 py-2 text-sm text-[#2c1810]"
//                       />
//                       <span className="text-sm font-semibold text-[#2c1810]">
//                         {formatCurrency(getLineTotal(item, addOnMap))}
//                       </span>
//                     </div>
//                   </div>
//                 </motion.div>
//               ))}
//             </AnimatePresence>
//           )}
//         </div>

//         <div className="grid gap-2 border-t border-dashed border-[#d8bf9f] pt-3 text-sm text-[#4b2f22]">
//           <div className="flex justify-between">
//             <span>Subtotal</span>
//             <span>{formatCurrency(subtotalCents)}</span>
//           </div>
//           <div className="flex justify-between text-base font-semibold text-[#2c1810]">
//             <span>Total</span>
//             <span>{formatCurrency(subtotalCents)}</span>
//           </div>
//           <label className="grid gap-1 text-sm font-medium text-[#4b2f22]">
//             Cash received
//             <input
//               type="number"
//               min="0"
//               step="0.01"
//               value={amountPaid}
//               onChange={(event) => setAmountPaid(event.target.value)}
//               className="coffee-focus rounded-2xl border border-[#d8bf9f] bg-white px-3 py-2 text-[#2c1810]"
//             />
//           </label>
//           <div className="flex justify-between font-semibold text-[#3e621d]">
//             <span>Change</span>
//             <span>{formatCurrency(changeCents)}</span>
//           </div>
//           {result ? (
//             <div
//               className={`rounded-2xl px-3 py-2 text-sm ${
//                 result.ok
//                   ? "border border-[#cfdfb0] bg-[#f1f7e8] text-[#3e621d]"
//                   : "border border-rose-200 bg-rose-50 text-rose-800"
//               }`}
//             >
//               {result.message}
//               {result.receiptNo ? (
//                 <span className="block font-semibold">{result.receiptNo}</span>
//               ) : null}
//             </div>
//           ) : null}
//           <AnimatedButton
//             type="button"
//             disabled={cart.length === 0 || isPending}
//             onClick={completeSale}
//             className="rounded-2xl bg-[#2c1810] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#4b2f22] disabled:cursor-not-allowed disabled:bg-[#d9c3aa]"
//           >
//             {isPending ? "Completing..." : "Complete sale"}
//           </AnimatedButton>
//         </div>
//       </aside>

//       <AnimatePresence>
//         {showReceiptModal && result?.ok ? (
//           <motion.div
//             className="fixed inset-0 z-50 grid place-items-center bg-[#2c1810]/45 px-4 backdrop-blur-sm"
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//           >
//             <motion.div
//               initial={{ opacity: 0, y: 24, scale: 0.96 }}
//               animate={{ opacity: 1, y: 0, scale: 1 }}
//               exit={{ opacity: 0, y: 18, scale: 0.96 }}
//               transition={{ duration: 0.22, ease: "easeOut" }}
//               className="w-full max-w-sm rounded-3xl border border-[#ead8c5] bg-[#fffaf3] p-5 shadow-[var(--shadow-soft)]"
//             >
//               <p className="text-sm font-semibold uppercase tracking-wide text-[#c9823a]">
//                 Checkout complete
//               </p>
//               <h3 className="mt-2 text-2xl font-semibold text-[#2c1810]">
//                 {result.receiptNo}
//               </h3>
//               <div className="mt-4 rounded-2xl bg-white/70 p-4 text-sm text-[#4b2f22]">
//                 <div className="flex justify-between">
//                   <span>Total</span>
//                   <span>{formatCurrency(result.totalCents ?? 0)}</span>
//                 </div>
//                 <div className="mt-2 flex justify-between font-semibold text-[#3e621d]">
//                   <span>Change</span>
//                   <span>{formatCurrency(result.changeCents ?? 0)}</span>
//                 </div>
//               </div>
//               <AnimatedButton
//                 type="button"
//                 onClick={() => setShowReceiptModal(false)}
//                 className="mt-4 w-full rounded-2xl bg-[#7a4b2c] px-4 py-3 text-sm font-semibold text-white"
//               >
//                 Close receipt
//               </AnimatedButton>
//             </motion.div>
//           </motion.div>
//         ) : null}
//       </AnimatePresence>
//     </div>
//   );
// }

// function getLineTotal(item: CartItem, addOnMap: Map<number, POSProduct>) {
//   const addOnsTotal = item.addOnIds.reduce(
//     (total, id) => total + (addOnMap.get(id)?.priceCents ?? 0),
//     0,
//   );

//   return (item.priceCents + addOnsTotal) * item.quantity;
// }

// function createCartId() {
//   if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
//     return crypto.randomUUID();
//   }

//   return `${Date.now()}-${Math.random()}`;
// }


"use client";

import { useMemo, useState, useTransition } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { completeSaleAction, type CheckoutResult } from "@/app/actions/sales";
import { formatCurrency } from "@/app/lib/format";
import {
  ORDER_TYPES,
  TEMPERATURE_OPTIONS,
  isDrinkCategory,
  orderTypeLabels,
  productCategoryLabels,
  productSizeLabels,
  temperatureLabels,
  type OrderTypeValue,
  type ProductCategoryValue,
  type ProductSizeValue,
  type TemperatureValue,
} from "@/app/lib/labels";
import {
  AnimatedButton,
  AnimatedItem,
  AnimatedList,
} from "@/app/Shared/Motion/Motion";

export type POSProduct = {
  id: number;
  name: string;
  category: ProductCategoryValue;
  size: ProductSizeValue;
  sku: string;
  priceCents: number;
  stock: number;
};

type CartItem = POSProduct & {
  cartId: string;
  quantity: number;
  temperature: TemperatureValue;
  addOnIds: number[];
};

type POSClientProps = {
  products: POSProduct[];
  addOns: POSProduct[];
};

export default function POSClient({ products, addOns }: POSClientProps) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("ALL");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orderType, setOrderType] = useState<OrderTypeValue>("DINE_IN");
  const [amountPaid, setAmountPaid] = useState("");
  const [result, setResult] = useState<CheckoutResult | null>(null);
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [isPending, startTransition] = useTransition();

  const categories = useMemo(
    () => ["ALL", ...new Set(products.map((product) => product.category))],
    [products],
  );

  const filteredProducts = products.filter((product) => {
    const q = query.trim().toLowerCase();
    const matchesQuery =
      q === "" ||
      product.name.toLowerCase().includes(q) ||
      product.sku.toLowerCase().includes(q);
    const matchesCategory = category === "ALL" || product.category === category;
    return matchesQuery && matchesCategory;
  });

  const addOnMap = new Map(addOns.map((addOn) => [addOn.id, addOn]));
  const subtotalCents = cart.reduce(
    (total, item) => total + getLineTotal(item, addOnMap),
    0,
  );
  const paidCents = Math.round((Number(amountPaid) || 0) * 100);
  const changeCents = Math.max(0, paidCents - subtotalCents);

  function addToCart(product: POSProduct) {
    setResult(null);
    setShowReceiptModal(false);
    setCart((current) => [
      ...current,
      {
        ...product,
        cartId: createCartId(),
        quantity: 1,
        temperature: isDrinkCategory(product.category) ? "ICED" : "NOT_APPLICABLE",
        addOnIds: [],
      },
    ]);
  }

  function updateQuantity(cartId: string, quantity: number) {
    setCart((current) =>
      current.map((item) =>
        item.cartId === cartId
          ? { ...item, quantity: Math.max(1, Math.min(999, quantity)) }
          : item,
      ),
    );
  }

  function toggleAddOn(cartId: string, addOnId: number) {
    setCart((current) =>
      current.map((item) => {
        if (item.cartId !== cartId) return item;
        const hasAddOn = item.addOnIds.includes(addOnId);
        return {
          ...item,
          addOnIds: hasAddOn
            ? item.addOnIds.filter((id) => id !== addOnId)
            : [...item.addOnIds, addOnId],
        };
      }),
    );
  }

  function updateTemperature(cartId: string, temperature: TemperatureValue) {
    setCart((current) =>
      current.map((item) =>
        item.cartId === cartId ? { ...item, temperature } : item,
      ),
    );
  }

  function removeItem(cartId: string) {
    setCart((current) => current.filter((item) => item.cartId !== cartId));
  }

  function completeSale() {
    setResult(null);
    startTransition(async () => {
      const response = await completeSaleAction({
        orderType,
        amountPaidCents: paidCents,
        items: cart.map((item) => ({
          productId: item.id,
          quantity: item.quantity,
          temperature: item.temperature,
          addOnIds: item.addOnIds,
        })),
      });
      setResult(response);
      if (response.ok) {
        setCart([]);
        setAmountPaid("");
        setShowReceiptModal(true);
      }
    });
  }

  return (
    <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_430px]">
      <section className="grid gap-4">
        {/* Search bar */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.28, ease: "easeOut" }}
          className="flex h-14 items-center gap-2 overflow-hidden rounded-3xl border border-[#ead8c5] bg-[#fffaf3]/90 px-4 shadow-[var(--shadow-card)]"
        >
          <svg
            className="size-4 shrink-0 text-[#a07850]"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>

          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search drinks, pastries, SKU…"
            className="h-10 min-w-0 flex-1 bg-transparent text-sm text-[#2c1810] outline-none placeholder:text-[#b89a7a]"
          />

          <div className="h-5 w-px shrink-0 bg-[#d8bf9f]" />

          <div className="flex items-center gap-1.5 overflow-x-auto">
            {categories.map((item) => (
              <AnimatedButton
                key={item}
                type="button"
                onClick={() => setCategory(item)}
                className={`h-9 whitespace-nowrap rounded-xl px-3 text-xs font-semibold transition ${
                  category === item
                    ? "bg-[#8B5A35] text-white shadow-sm shadow-[#8B5A35]/20"
                    : "border border-[#d8bf9f] bg-white/70 text-[#4b2f22] hover:bg-[#fff8ef]"
                }`}
              >
                {item === "ALL"
                  ? "All"
                  : productCategoryLabels[item as ProductCategoryValue]}
              </AnimatedButton>
            ))}
          </div>
        </motion.div>

        {filteredProducts.length === 0 ? (
          <p className="rounded-3xl border border-dashed border-[#d8bf9f] bg-[#fff8ef] px-4 py-12 text-center text-sm text-[#8a6b58]">
            No matching menu items.
          </p>
        ) : (
          <AnimatedList className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {filteredProducts.map((product) => (
              <AnimatedItem key={product.id}>
                <article className="grid min-h-48 gap-3 rounded-3xl border border-[#ead8c5] bg-[#fffaf3] p-4 shadow-[var(--shadow-card)] transition hover:border-[#d8bf9f]">
                  <div>
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="font-semibold text-[#2c1810]">
                        {product.name}
                      </h3>
                      <span className="rounded-full bg-[#f3e6d5] px-2 py-1 text-xs font-semibold text-[#6f4b35]">
                        {formatCurrency(product.priceCents)}
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-[#8a6b58]">
                      {productCategoryLabels[product.category]} /{" "}
                      {productSizeLabels[product.size]}
                    </p>
                  </div>
                  <div className="mt-auto flex items-center justify-between gap-3">
                    <span
                      className={`rounded-full px-2 py-1 text-xs font-semibold ${
                        product.stock <= 0
                          ? "bg-rose-50 text-rose-700"
                          : "bg-[#efe4d2] text-[#6f4b35]"
                      }`}
                    >
                      Stock: {product.stock}
                    </span>
                    <AnimatedButton
                      type="button"
                      disabled={product.stock <= 0}
                      onClick={() => addToCart(product)}
                      className="rounded-2xl bg-[#7a4b2c] px-3 py-2 text-sm font-semibold text-white shadow-sm shadow-[#7a4b2c]/20 hover:bg-[#61361f] disabled:cursor-not-allowed disabled:bg-[#d9c3aa]"
                    >
                      Add
                    </AnimatedButton>
                  </div>
                </article>
              </AnimatedItem>
            ))}
          </AnimatedList>
        )}
      </section>

      <aside className="grid gap-4 rounded-3xl border border-[#ead8c5] bg-[#fffaf3] p-4 shadow-[var(--shadow-soft)] xl:sticky xl:top-4 xl:self-start">
        <div className="border-b border-dashed border-[#d8bf9f] pb-3">
          <h2 className="text-lg font-semibold text-[#2c1810]">Receipt</h2>
          <div className="mt-3 grid grid-cols-2 gap-2">
            {ORDER_TYPES.map((type) => (
              <AnimatedButton
                key={type}
                type="button"
                onClick={() => setOrderType(type)}
                className={`rounded-2xl px-3 py-2 text-sm font-semibold ${
                  orderType === type
                    ? "bg-[#2c1810] text-white"
                    : "border border-[#d8bf9f] bg-white/70 text-[#4b2f22]"
                }`}
              >
                {orderTypeLabels[type]}
              </AnimatedButton>
            ))}
          </div>
        </div>

        <div className="grid max-h-[540px] gap-3 overflow-y-auto pr-1">
          {cart.length === 0 ? (
            <p className="rounded-3xl border border-dashed border-[#d8bf9f] bg-[#fff8ef] px-4 py-10 text-center text-sm text-[#8a6b58]">
              Cart is empty.
            </p>
          ) : (
            <AnimatePresence initial={false}>
              {cart.map((item) => (
                <motion.div
                  key={item.cartId}
                  layout
                  initial={{ opacity: 0, x: 18, scale: 0.98 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, x: 18, scale: 0.98 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                  className="rounded-3xl border border-[#ead8c5] bg-white/65 p-3"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="text-sm font-semibold text-[#2c1810]">
                        {item.name}
                      </h3>
                      <p className="text-xs text-[#8a6b58]">
                        {item.sku} / {productSizeLabels[item.size]}
                      </p>
                    </div>
                    <AnimatedButton
                      type="button"
                      onClick={() => removeItem(item.cartId)}
                      className="text-sm font-semibold text-rose-600"
                    >
                      Remove
                    </AnimatedButton>
                  </div>

                  <div className="mt-3 grid gap-2">
                    {isDrinkCategory(item.category) ? (
                      <select
                        value={item.temperature}
                        onChange={(event) =>
                          updateTemperature(
                            item.cartId,
                            event.target.value as TemperatureValue,
                          )
                        }
                        className="coffee-focus rounded-2xl border border-[#d8bf9f] bg-white px-3 py-2 text-sm text-[#2c1810]"
                      >
                        {TEMPERATURE_OPTIONS.filter(
                          (temperature) => temperature !== "NOT_APPLICABLE",
                        ).map((temperature) => (
                          <option key={temperature} value={temperature}>
                            {temperatureLabels[temperature]}
                          </option>
                        ))}
                      </select>
                    ) : null}

                    {addOns.length > 0 ? (
                      <div className="grid gap-1 rounded-2xl bg-[#fff8ef] p-2">
                        {addOns.map((addOn) => (
                          <label
                            key={addOn.id}
                            className="flex items-center justify-between gap-2 text-xs text-[#4b2f22]"
                          >
                            <span className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                checked={item.addOnIds.includes(addOn.id)}
                                onChange={() => toggleAddOn(item.cartId, addOn.id)}
                                className="size-4 rounded border-[#d8bf9f]"
                              />
                              {addOn.name}
                            </span>
                            <span>{formatCurrency(addOn.priceCents)}</span>
                          </label>
                        ))}
                      </div>
                    ) : null}

                    <div className="flex items-center justify-between gap-3">
                      <input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(event) =>
                          updateQuantity(item.cartId, Number(event.target.value))
                        }
                        className="coffee-focus w-24 rounded-2xl border border-[#d8bf9f] bg-white px-3 py-2 text-sm text-[#2c1810]"
                      />
                      <span className="text-sm font-semibold text-[#2c1810]">
                        {formatCurrency(getLineTotal(item, addOnMap))}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </div>

        <div className="grid gap-2 border-t border-dashed border-[#d8bf9f] pt-3 text-sm text-[#4b2f22]">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>{formatCurrency(subtotalCents)}</span>
          </div>
          <div className="flex justify-between text-base font-semibold text-[#2c1810]">
            <span>Total</span>
            <span>{formatCurrency(subtotalCents)}</span>
          </div>
          <label className="grid gap-1 text-sm font-medium text-[#4b2f22]">
            Cash received
            <input
              type="number"
              min="0"
              step="0.01"
              value={amountPaid}
              onChange={(event) => setAmountPaid(event.target.value)}
              className="coffee-focus rounded-2xl border border-[#d8bf9f] bg-white px-3 py-2 text-[#2c1810]"
            />
          </label>
          <div className="flex justify-between font-semibold text-[#3e621d]">
            <span>Change</span>
            <span>{formatCurrency(changeCents)}</span>
          </div>
          {result ? (
            <div
              className={`rounded-2xl px-3 py-2 text-sm ${
                result.ok
                  ? "border border-[#cfdfb0] bg-[#f1f7e8] text-[#3e621d]"
                  : "border border-rose-200 bg-rose-50 text-rose-800"
              }`}
            >
              {result.message}
              {result.receiptNo ? (
                <span className="block font-semibold">{result.receiptNo}</span>
              ) : null}
            </div>
          ) : null}
          <AnimatedButton
            type="button"
            disabled={cart.length === 0 || isPending}
            onClick={completeSale}
            className="rounded-2xl bg-[#2c1810] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#4b2f22] disabled:cursor-not-allowed disabled:bg-[#d9c3aa]"
          >
            {isPending ? "Completing..." : "Complete sale"}
          </AnimatedButton>
        </div>
      </aside>

      <AnimatePresence>
        {showReceiptModal && result?.ok ? (
          <motion.div
            className="fixed inset-0 z-50 grid place-items-center bg-[#2c1810]/45 px-4 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ opacity: 0, y: 24, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 18, scale: 0.96 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
              className="w-full max-w-sm rounded-3xl border border-[#ead8c5] bg-[#fffaf3] p-5 shadow-[var(--shadow-soft)]"
            >
              <p className="text-sm font-semibold uppercase tracking-wide text-[#c9823a]">
                Checkout complete
              </p>
              <h3 className="mt-2 text-2xl font-semibold text-[#2c1810]">
                {result.receiptNo}
              </h3>
              <div className="mt-4 rounded-2xl bg-white/70 p-4 text-sm text-[#4b2f22]">
                <div className="flex justify-between">
                  <span>Total</span>
                  <span>{formatCurrency(result.totalCents ?? 0)}</span>
                </div>
                <div className="mt-2 flex justify-between font-semibold text-[#3e621d]">
                  <span>Change</span>
                  <span>{formatCurrency(result.changeCents ?? 0)}</span>
                </div>
              </div>
              <AnimatedButton
                type="button"
                onClick={() => setShowReceiptModal(false)}
                className="mt-4 w-full rounded-2xl bg-[#7a4b2c] px-4 py-3 text-sm font-semibold text-white"
              >
                Close receipt
              </AnimatedButton>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

function getLineTotal(item: CartItem, addOnMap: Map<number, POSProduct>) {
  const addOnsTotal = item.addOnIds.reduce(
    (total, id) => total + (addOnMap.get(id)?.priceCents ?? 0),
    0,
  );
  return (item.priceCents + addOnsTotal) * item.quantity;
}

function createCartId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random()}`;
}
