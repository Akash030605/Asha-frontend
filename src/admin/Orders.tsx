import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon, X, Plus, Search, Trash2, Loader2 } from "lucide-react";

type Order = {
  _id: string;
  bill_id?: string;
  status: string;
  final_amount: number;
  total_amount: number;
  discount: number;
  order_date?: string;
  delivery_date?: string;
  customer_id?: string;
  customer?: { 
    _id?: string;
    full_name?: string; 
    phone_number?: string;
  };
  works?: string[];
  work_details?: Array<{
    _id: string;
    work_type: string;
    fixed_amount: number;
  }>;
  notes?: string;
  image?: string;
};

type Customer = {
  _id: string;
  full_name: string;
  phone_number: string;
  email?: string;
  address?: string;
};

type Work = {
  _id: string;
  work_type: string;
  fixed_amount: number;
  description?: string;
};

const Orders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [works, setWorks] = useState<Work[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [customerSearch, setCustomerSearch] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [selectedWorks, setSelectedWorks] = useState<Array<{ work: Work; customAmount?: number }>>([]);
  const [orderDate, setOrderDate] = useState<Date>(new Date());
  const [deliveryDate, setDeliveryDate] = useState<Date>();
  const [discount, setDiscount] = useState("0");
  const [status, setStatus] = useState("pending");
  const [notes, setNotes] = useState("");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Calculate total amount
  const totalAmount = selectedWorks.reduce((sum, item) => {
    const amount = item.customAmount || item.work.fixed_amount;
    return sum + amount;
  }, 0);

  const finalAmount = totalAmount - parseFloat(discount || "0");

  useEffect(() => {
    loadOrders();
    loadCustomers();
    loadWorks();
  }, []);

  const loadOrders = async (search = "") => {
    setLoading(true);
    try {
      const token = localStorage.getItem("admin_token") || undefined;
      const res: any = await apiFetch(`/api/orders`, { token });
      
      // Handle different response formats
      let ordersList = [];
      if (res.data?.orders) {
        ordersList = res.data.orders;
      } else if (Array.isArray(res.data)) {
        ordersList = res.data;
      } else if (Array.isArray(res)) {
        ordersList = res;
      } else if (res.orders) {
        ordersList = res.orders;
      } else {
        ordersList = [];
      }

      // Filter by search if needed
      if (search) {
        ordersList = ordersList.filter((order: Order) => 
          order._id?.toLowerCase().includes(search.toLowerCase()) ||
          order.customer?.full_name?.toLowerCase().includes(search.toLowerCase()) ||
          order.customer?.phone_number?.includes(search)
        );
      }

      setOrders(ordersList);
    } catch (err: any) {
      console.error("Failed to load orders:", err);
      setError(err?.message || "Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  const loadCustomers = async () => {
    try {
      const token = localStorage.getItem("admin_token") || undefined;
      // Try different possible endpoints
      let customersList: Customer[] = [];
      
      try {
        const res: any = await apiFetch("/api/customers", { token });
        customersList = res.data?.customers || res.data || [];
      } catch {
        // Try alternative endpoint
        try {
          const res: any = await apiFetch("/api/users", { token });
          customersList = res.data?.users || res.data || [];
        } catch {
          // Try another alternative
          const res: any = await apiFetch("/admin/owner/users", { token });
          customersList = res.data?.users || res.data || [];
        }
      }
      
      setCustomers(customersList);
      console.log("Loaded customers:", customersList); // Debug log
    } catch (err) {
      console.error("Failed to load customers:", err);
    }
  };

  const loadWorks = async () => {
    try {
      const token = localStorage.getItem("admin_token") || undefined;
      let worksList: Work[] = [];
      
      try {
        const res: any = await apiFetch("/api/works", { token });
        worksList = res.data?.works || res.data || [];
      } catch {
        // Try alternative endpoint
        const res: any = await apiFetch("/admin/owner/works", { token });
        worksList = res.data?.works || res.data || [];
      }
      
      setWorks(worksList);
      console.log("Loaded works:", worksList); // Debug log
    } catch (err) {
      console.error("Failed to load works:", err);
      setError("Failed to load work types. Please refresh the page.");
    }
  };

  const getCustomerDetails = (order: Order) => {
    // If customer object is already populated
    if (order.customer && order.customer.full_name) {
      return order.customer;
    }
    
    // If only customer_id exists, find from customers list
    if (order.customer_id) {
      const customer = customers.find(c => c._id === order.customer_id);
      if (customer) {
        return customer;
      }
    }
    
    return null;
  };

  const getWorkDetails = (order: Order) => {
    // If work_details is already populated
    if (order.work_details && order.work_details.length > 0) {
      return order.work_details;
    }
    
    // If only works array exists, find from works list
    if (order.works && order.works.length > 0) {
      const workDetails = order.works
        .map(workId => works.find(w => w._id === workId))
        .filter((w): w is Work => w !== undefined);
      return workDetails;
    }
    
    return [];
  };

  const filteredCustomers = customers.filter(customer =>
    customer.full_name?.toLowerCase().includes(customerSearch.toLowerCase()) ||
    customer.phone_number?.includes(customerSearch)
  );

  const handleAddWork = (workId: string) => {
    const work = works.find(w => w._id === workId);
    if (work && !selectedWorks.some(item => item.work._id === workId)) {
      setSelectedWorks([...selectedWorks, { work, customAmount: work.fixed_amount }]);
    }
  };

  const handleRemoveWork = (workId: string) => {
    setSelectedWorks(selectedWorks.filter(item => item.work._id !== workId));
  };

  const handleCustomAmountChange = (workId: string, amount: string) => {
    setSelectedWorks(selectedWorks.map(item =>
      item.work._id === workId
        ? { ...item, customAmount: parseFloat(amount) || item.work.fixed_amount }
        : item
    ));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    }
  };

  const handleCreateOrder = async () => {
    setError(null);
    
    if (!selectedCustomer) {
      setError("Please select a customer");
      return;
    }
    
    if (selectedWorks.length === 0) {
      setError("Please add at least one work");
      return;
    }
    
    if (!deliveryDate) {
      setError("Please select a delivery date");
      return;
    }

    setIsSubmitting(true);
    
    try {
      const token = localStorage.getItem("admin_token") || undefined;
      
      // Create FormData for multipart/form-data to support image upload
      const formData = new FormData();
      formData.append("customer_id", selectedCustomer._id);
      selectedWorks.forEach(item => {
        formData.append("works", item.work._id);
      });
      formData.append("order_date", format(orderDate, 'yyyy-MM-dd'));
      formData.append("delivery_date", format(deliveryDate, 'yyyy-MM-dd'));
      formData.append("total_amount", totalAmount.toString());
      formData.append("discount", parseFloat(discount || "0").toString());
      formData.append("status", status);
      formData.append("notes", notes);
      
      if (selectedImage) {
        formData.append("image", selectedImage);
      }
      
      await apiFetch("/api/orders", { 
        method: "POST", 
        token, 
        body: formData,
        headers: {} // Let browser set Content-Type for FormData
      });
      
      await loadOrders();
      
      // Reset form
      setSelectedCustomer(null);
      setSelectedWorks([]);
      setOrderDate(new Date());
      setDeliveryDate(undefined);
      setDiscount("0");
      setStatus("pending");
      setNotes("");
      setCustomerSearch("");
      setSelectedImage(null);
      setImagePreview(null);
      
    } catch (err: any) {
      console.error("Failed to create order:", err);
      setError(err?.message || "Failed to add order");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteOrder = async (orderId: string) => {
    if (!confirm("Are you sure you want to delete this order?")) return;
    
    try {
      setLoading(true);
      const token = localStorage.getItem("admin_token") || undefined;
      await apiFetch(`/api/orders/${orderId}`, { method: "DELETE", token });
      await loadOrders();
    } catch (err: any) {
      console.error("Failed to delete order:", err);
      setError(err?.message || "Failed to delete order");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-serif font-bold mb-6">Orders Management</h2>
      
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          {error}
          <button 
            className="float-right font-bold" 
            onClick={() => setError(null)}
          >
            ×
          </button>
        </div>
      )}

      {/* Add Order Form */}
      <div className="mb-6 border rounded-lg p-4 bg-card shadow-sm">
        <h3 className="font-semibold mb-4 text-lg">Create New Order</h3>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column */}
          <div>
            {/* Customer Selection */}
            <div className="mb-4">
              <label className="text-sm font-medium mb-2 block">Customer *</label>
              <div className="relative">
                <Input
                  placeholder="Search customer by name or phone..."
                  value={customerSearch}
                  onChange={(e) => setCustomerSearch(e.target.value)}
                />
                {customerSearch && filteredCustomers.length > 0 && (
                  <div className="absolute z-10 w-full mt-1 bg-white border rounded-lg shadow-lg max-h-60 overflow-y-auto">
                    {filteredCustomers.map(customer => (
                      <div
                        key={customer._id}
                        className="px-3 py-2 hover:bg-gray-100 cursor-pointer border-b last:border-b-0"
                        onClick={() => {
                          setSelectedCustomer(customer);
                          setCustomerSearch(`${customer.full_name} - ${customer.phone_number}`);
                        }}
                      >
                        <div className="font-medium">{customer.full_name}</div>
                        <div className="text-sm text-gray-600">{customer.phone_number}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              {selectedCustomer && (
                <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded">
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="font-medium">{selectedCustomer.full_name}</span>
                      <span className="text-gray-600 ml-2">{selectedCustomer.phone_number}</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setSelectedCustomer(null);
                        setCustomerSearch("");
                      }}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </div>

            {/* Work Selection */}
            <div className="mb-4">
              <label className="text-sm font-medium mb-2 block">Add Work *</label>
              <Select onValueChange={handleAddWork}>
                <SelectTrigger>
                  <SelectValue placeholder={works.length === 0 ? "Loading work types..." : "Select work type"} />
                </SelectTrigger>
                <SelectContent>
                  {works.length === 0 ? (
                    <div className="px-2 py-4 text-center text-gray-500">
                      <Loader2 className="h-4 w-4 animate-spin inline mr-2" />
                      Loading works...
                    </div>
                  ) : (
                    works.map(work => (
                      <SelectItem key={work._id} value={work._id}>
                        {work.work_type} - ₹{work.fixed_amount.toLocaleString('en-IN')}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
              {works.length === 0 && !loading && (
                <p className="text-xs text-red-500 mt-1">
                  No work types found. Please add work types first.
                </p>
              )}
            </div>

            {/* Notes */}
            <div className="mb-4">
              <label className="text-sm font-medium mb-2 block">Notes</label>
              <Input
                placeholder="Additional notes..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>
          </div>

          {/* Right Column */}
          <div>
            {/* Order Date */}
            <div className="mb-4">
              <label className="text-sm font-medium mb-2 block">Order Date *</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {orderDate ? format(orderDate, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={orderDate}
                    onSelect={(date) => date && setOrderDate(date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Delivery Date */}
            <div className="mb-4">
              <label className="text-sm font-medium mb-2 block">Delivery Date *</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {deliveryDate ? format(deliveryDate, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={deliveryDate}
                    onSelect={setDeliveryDate}
                    initialFocus
                    disabled={(date) => date < orderDate}
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Status */}
            <div className="mb-4">
              <label className="text-sm font-medium mb-2 block">Status</label>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Image Upload */}
            <div className="mb-4">
              <label className="text-sm font-medium mb-2 block">Order Image (Optional)</label>
              <Input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="cursor-pointer"
              />
              {imagePreview && (
                <div className="mt-2">
                  <img src={imagePreview} alt="Preview" className="h-20 w-20 object-cover rounded" />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Selected Works */}
        {selectedWorks.length > 0 && (
          <div className="mb-4">
            <label className="text-sm font-medium mb-2 block">Selected Works</label>
            <div className="space-y-2">
              {selectedWorks.map((item) => (
                <div key={item.work._id} className="flex items-center gap-3 p-2 border rounded">
                  <div className="flex-1">
                    <div className="font-medium">{item.work.work_type}</div>
                    <div className="text-sm text-gray-600">Fixed: ₹{item.work.fixed_amount.toLocaleString('en-IN')}</div>
                  </div>
                  <Input
                    type="number"
                    placeholder="Custom amount"
                    value={item.customAmount || ""}
                    onChange={(e) => handleCustomAmountChange(item.work._id, e.target.value)}
                    className="w-32"
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveWork(item.work._id)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Discount */}
        <div className="mb-4">
          <label className="text-sm font-medium mb-2 block">Discount (₹)</label>
          <Input
            type="number"
            placeholder="Discount amount"
            value={discount}
            onChange={(e) => setDiscount(e.target.value)}
            className="w-full md:w-64"
          />
        </div>

        {/* Amount Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 p-3 bg-gray-50 rounded">
          <div>
            <div className="text-sm text-gray-600">Total Amount</div>
            <div className="text-lg font-semibold">₹{totalAmount.toLocaleString('en-IN')}</div>
          </div>
          <div>
            <div className="text-sm text-gray-600">Discount</div>
            <div className="text-lg font-semibold">₹{parseFloat(discount || "0").toLocaleString('en-IN')}</div>
          </div>
          <div>
            <div className="text-sm text-gray-600">Final Amount</div>
            <div className="text-lg font-semibold text-green-600">
              ₹{finalAmount.toLocaleString('en-IN')}
            </div>
          </div>
        </div>

        <Button onClick={handleCreateOrder} className="w-full" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Creating Order...
            </>
          ) : (
            <>
              <Plus className="w-4 h-4 mr-2" />
              Create Order
            </>
          )}
        </Button>
      </div>

      {/* Search */}
      <div className="mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search by order ID, customer name, or phone..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              loadOrders(e.target.value);
            }}
          />
        </div>
      </div>

      {/* Orders Table */}
      <div className="overflow-x-auto border rounded-lg">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left p-3 font-semibold">Order ID</th>
              <th className="text-left p-3 font-semibold">Customer</th>
              <th className="text-left p-3 font-semibold">Works</th>
              <th className="text-left p-3 font-semibold">Status</th>
              <th className="text-left p-3 font-semibold">Final Amount</th>
              <th className="text-left p-3 font-semibold">Order Date</th>
              <th className="text-left p-3 font-semibold">Delivery Date</th>
              <th className="text-left p-3 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading && orders.length === 0 ? (
              <tr>
                <td colSpan={8} className="text-center py-8">
                  <div className="flex justify-center items-center gap-2">
                    <Loader2 className="h-6 w-6 animate-spin" />
                    <span>Loading orders...</span>
                  </div>
                </td>
              </tr>
            ) : orders.map((order) => {
              const customer = getCustomerDetails(order);
              const workDetails = getWorkDetails(order);
              
              return (
                <tr key={order._id} className="border-t hover:bg-gray-50">
                  <td className="p-3 font-mono text-xs">
                    {order.bill_id || order._id.slice(-8)}
                  </td>
                  <td className="p-3">
                    {customer ? (
                      <div>
                        <div className="font-medium">{customer.full_name || "-"}</div>
                        <div className="text-xs text-gray-500">{customer.phone_number || ""}</div>
                      </div>
                    ) : (
                      <span className="text-gray-400">No customer</span>
                    )}
                  </td>
                  <td className="p-3">
                    {workDetails.length > 0 ? (
                      <div className="flex flex-wrap gap-1">
                        {workDetails.map(work => (
                          <span 
                            key={work._id} 
                            className="inline-flex items-center px-2 py-1 rounded text-xs bg-blue-100 text-blue-800"
                          >
                            {work.work_type} (₹{work.fixed_amount.toLocaleString('en-IN')})
                          </span>
                        ))}
                      </div>
                    ) : (
                      <span className="text-gray-400">No works</span>
                    )}
                  </td>
                  <td className="p-3">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium capitalize ${
                      order.status === 'completed' ? 'bg-green-100 text-green-800' :
                      order.status === 'paid' ? 'bg-blue-100 text-blue-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {order.status || 'pending'}
                    </span>
                  </td>
                  <td className="p-3 font-semibold">
                    ₹{Number(order.final_amount || 0).toLocaleString('en-IN')}
                  </td>
                  <td className="p-3">
                    {order.order_date ? new Date(order.order_date).toLocaleDateString() : "-"}
                  </td>
                  <td className="p-3">
                    {order.delivery_date ? new Date(order.delivery_date).toLocaleDateString() : "-"}
                  </td>
                  <td className="p-3">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteOrder(order._id)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        
        {!loading && orders.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            {searchQuery ? "No orders found matching your search" : "No orders found. Create your first order!"}
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;