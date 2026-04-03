import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon, X, Plus, Search } from "lucide-react";

type Order = {
  _id: string;
  bill_id: string;
  status: string;
  final_amount: number;
  total_amount: number;
  discount: number;
  order_date?: string;
  delivery_date?: string;
  customer?: { full_name?: string; phone_number?: string };
  work_details?: Array<{
    _id: string;
    work_type: string;
    fixed_amount: number;
  }>;
};

type Customer = {
  _id: string;
  full_name: string;
  phone_number: string;
};

type Work = {
  _id: string;
  work_type: string;
  fixed_amount: number;
};

const Orders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [works, setWorks] = useState<Work[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [customerSearch, setCustomerSearch] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [selectedWorks, setSelectedWorks] = useState<Array<{ work: Work; customAmount?: number }>>([]);
  const [orderDate, setOrderDate] = useState<Date>(new Date());
  const [deliveryDate, setDeliveryDate] = useState<Date>();
  const [discount, setDiscount] = useState("0");
  const [status, setStatus] = useState("Pending");

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
    try {
      const token = localStorage.getItem("admin_token") || undefined;
      const res: any = await apiFetch(`/admin/owner/orders?limit=50&search=${encodeURIComponent(search)}`, { token });
      const list = res.data?.orders || res.data || [];
      setOrders(list);
    } catch (err: any) {
      setError(err?.message || "Failed to load orders");
    }
  };

  const loadCustomers = async () => {
    try {
      const token = localStorage.getItem("admin_token") || undefined;
      const res: any = await apiFetch("/admin/owner/users?limit=1000", { token });
      const list = res.data?.users || res.data || [];
      setCustomers(list);
    } catch {
      // silently fail — UI shows empty state
    }
  };

  const loadWorks = async () => {
    try {
      const token = localStorage.getItem("admin_token") || undefined;
      const res: any = await apiFetch("/admin/owner/works?limit=1000", { token });
      const list = res.data?.works || res.data || [];
      setWorks(list);
    } catch {
      // silently fail — UI shows empty state
    }
  };

  const filteredCustomers = customers.filter(customer =>
    customer.full_name.toLowerCase().includes(customerSearch.toLowerCase()) ||
    customer.phone_number.includes(customerSearch)
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

    try {
      const token = localStorage.getItem("admin_token") || undefined;
      const body = {
        customer_id: selectedCustomer._id,
        works: selectedWorks.map(item => item.work._id),
        order_date: format(orderDate, 'yyyy-MM-dd'),
        delivery_date: format(deliveryDate, 'yyyy-MM-dd'),
        total_amount: totalAmount,
        discount: parseFloat(discount || "0"),
        status: status,
      };
      
      await apiFetch("/admin/owner/orders", { method: "POST", token, body });
      await loadOrders();
      
      // Reset form
      setSelectedCustomer(null);
      setSelectedWorks([]);
      setOrderDate(new Date());
      setDeliveryDate(undefined);
      setDiscount("0");
      setStatus("Pending");
      setCustomerSearch("");
    } catch (err: any) {
      setError(err?.message || "Failed to add order");
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-serif font-bold mb-6">Orders</h2>
      
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* Add Order Form */}
      <div className="mb-6 border rounded-lg p-4 bg-card">
        <h3 className="font-semibold mb-4">Add Order</h3>
        
        {/* Customer Selection */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Customer</label>
            <div className="relative">
              <Input
                placeholder="Search customer by name or phone..."
                value={customerSearch}
                onChange={(e) => setCustomerSearch(e.target.value)}
                onFocus={() => setCustomerSearch("")}
              />
              {customerSearch && (
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
                  {filteredCustomers.length === 0 && (
                    <div className="px-3 py-2 text-gray-500">No customers found</div>
                  )}
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
          <div>
            <label className="text-sm font-medium mb-2 block">Add Work</label>
            <Select onValueChange={handleAddWork}>
              <SelectTrigger>
                <SelectValue placeholder="Select work type" />
              </SelectTrigger>
              <SelectContent>
                {works.map(work => (
                  <SelectItem key={work._id} value={work._id}>
                    {work.work_type} - ₹{work.fixed_amount}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
                    <div className="text-sm text-gray-600">Fixed: ₹{item.work.fixed_amount}</div>
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

        {/* Dates and Amounts */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          {/* Order Date */}
          <div>
            <label className="text-sm font-medium mb-2 block">Order Date</label>
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
          <div>
            <label className="text-sm font-medium mb-2 block">Delivery Date</label>
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

          {/* Discount */}
          <div>
            <label className="text-sm font-medium mb-2 block">Discount</label>
            <Input
              type="number"
              placeholder="Discount"
              value={discount}
              onChange={(e) => setDiscount(e.target.value)}
            />
          </div>

          {/* Status */}
          <div>
            <label className="text-sm font-medium mb-2 block">Status</label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="Paid">Paid</SelectItem>
                <SelectItem value="Completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Amount Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 p-3 bg-muted rounded">
          <div>
            <div className="text-sm text-muted-foreground">Total Amount</div>
            <div className="text-lg font-semibold">₹{totalAmount.toLocaleString('en-IN')}</div>
          </div>
          <div>
            <div className="text-sm text-muted-foreground">Discount</div>
            <div className="text-lg font-semibold">₹{parseFloat(discount || "0").toLocaleString('en-IN')}</div>
          </div>
          <div>
            <div className="text-sm text-muted-foreground">Final Amount</div>
            <div className="text-lg font-semibold text-green-600">
              ₹{finalAmount.toLocaleString('en-IN')}
            </div>
          </div>
        </div>

        <Button onClick={handleCreateOrder} className="w-full">
          <Plus className="w-4 h-4 mr-2" />
          Create Order
        </Button>
      </div>

      {/* Search */}
      <div className="mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search bill id, customer name, phone, work type"
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
          <thead className="bg-muted/50">
            <tr>
              <th className="text-left p-3">Bill ID</th>
              <th className="text-left p-3">Customer</th>
              <th className="text-left p-3">Works</th>
              <th className="text-left p-3">Status</th>
              <th className="text-left p-3">Final Amount</th>
              <th className="text-left p-3">Order Date</th>
              <th className="text-left p-3">Delivery Date</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id} className="border-t hover:bg-muted/25">
                <td className="p-3 font-medium">{order.bill_id}</td>
                <td className="p-3">
                  <div>
                    <div className="font-medium">{order.customer?.full_name || "-"}</div>
                    <div className="text-xs text-muted-foreground">{order.customer?.phone_number || ""}</div>
                  </div>
                </td>
                <td className="p-3">
                  {order.work_details?.map(work => (
                    <div key={work._id} className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded mb-1">
                      {work.work_type} (₹{work.fixed_amount})
                    </div>
                  ))}
                </td>
                <td className="p-3">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    order.status === 'Completed' ? 'bg-green-100 text-green-800' :
                    order.status === 'Paid' ? 'bg-blue-100 text-blue-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {order.status}
                  </span>
                </td>
                <td className="p-3 font-semibold">₹{Number(order.final_amount).toLocaleString('en-IN')}</td>
                <td className="p-3">{order.order_date ? new Date(order.order_date).toLocaleDateString() : "-"}</td>
                <td className="p-3">{order.delivery_date ? new Date(order.delivery_date).toLocaleDateString() : "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {orders.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            {searchQuery ? "No orders found matching your search" : "No orders found"}
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;