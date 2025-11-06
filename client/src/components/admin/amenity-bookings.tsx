import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import HttpClient from "@/lib/axiosInstance";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Download, ChevronDown, ChevronUp } from "lucide-react";
import mockAmenityBookings from "@/data/mockAmenities";
import { format } from "date-fns";


export default function AmenityBookingsPanel() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [updatingId, setUpdatingId] = useState<string | number | null>(null);
  const [expandedRows, setExpandedRows] = useState<number[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    fetchAmenityBookings();
  }, []);

  const fetchAmenityBookings = async () => {
    setLoading(true);
    try {
      if (import.meta.env.DEV) {
        // Use mock data in development
        setBookings(mockAmenityBookings);
        setLoading(false);
        return;
      }

      const res = await HttpClient.get('/booking');
      const data = res.data?.data || res.data || [];
      // filter amenity bookings/orders
      const amenityBookings = data.filter((b: any) => b.type && b.type.startsWith('amenity'));
      setBookings(amenityBookings);
    } catch (e) {
      console.error('Failed to fetch bookings', e);
      toast({ title: 'Failed to load bookings', description: 'Could not load amenity bookings.' });
    } finally {
      setLoading(false);
    }
  };

  const toggleRowExpansion = (bookingId: number) => {
    setExpandedRows(prev => 
      prev.includes(bookingId)
        ? prev.filter(id => id !== bookingId)
        : [...prev, bookingId]
    );
  };

  const formatOrderItems = (items: any[]) => {
    return items.map(item => ({
      ...item,
      subtotal: item.qty * item.price
    }));
  };

  const exportToCSV = () => {
    try {
      if (bookings.length === 0) {
        toast({
          title: "No data to export",
          description: "There are no bookings available to export.",
          variant: "destructive",
        });
        return;
      }

      // Prepare headers and data for main bookings
      const headers = ['ID', 'Type', 'Date', 'Time', 'Customer', 'Contact', 'Payment Method', 'Status', 'Total'];
      const rows = bookings.map(b => [
        b.id || '-',
        b.amenity || '-',
        b.date || '-',
        b.time || '-',
        b.user?.name || '-',
        b.user?.phone || '-',
        b.paymentMethod ? (b.paymentMethod === 'gcash' ? 'GCash' : 'Cash') : '-',
        b.status || 'pending',
        (b.total || 0).toFixed(2)
      ]);
      
      // Create CSV content
      const csvContent = [
        headers.join(','),
        ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
      ].join('\n');

      // Create and trigger download
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `amenity-bookings-${format(new Date(), 'yyyy-MM-dd')}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: "Report exported successfully",
        description: "Your bookings report has been downloaded.",
      });
    } catch (error) {
      console.error('Failed to export report:', error);
      toast({
        title: "Export failed",
        description: "There was a problem generating your report. Please try again.",
        variant: "destructive",
      });
    }
  };

  const updateBookingStatus = async (id: string | number, status: string) => {
    setUpdatingId(id);
    try {
      await HttpClient.put(`/booking/${id}`, { status });
      toast({ title: `Booking ${status}`, description: `Booking ${id} marked ${status}.` });
      // refresh list
      await fetchAmenityBookings();
    } catch (e) {
      console.error('Failed to update booking status', e);
      toast({ title: 'Update failed', description: 'Could not update booking status.' });
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Amenity Orders & Bookings</CardTitle>
        <Button
          variant="outline"
          size="sm"
          onClick={exportToCSV}
          className="flex items-center gap-2"
        >
          <Download className="h-4 w-4" />
          Export Report
        </Button>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div>Loading...</div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Amenity</TableHead>
                <TableHead>Details</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bookings.map((b) => (
                <>
                  <TableRow key={b.id || b.createdAt}>
                    <TableCell>{b.id || '-'}</TableCell>
                    <TableCell>{b.type}</TableCell>
                    <TableCell>{b.amenity || '-'}</TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {b.date && <div>Date: {b.date} {b.time ? ` ${b.time}` : ''}</div>}
                        {b.user?.name && <div>Customer: {b.user.name}</div>}
                        {b.user?.phone && <div>Contact: {b.user.phone}</div>}
                        {b.specialRequests && <div>Notes: {b.specialRequests}</div>}
                        {b.paymentMethod && (
                          <div className="mt-1">
                            <strong>Payment Method:</strong> {b.paymentMethod === 'gcash' ? 'GCash' : 'Cash'}
                          </div>
                        )}
                        <div className="mt-1">
                          <span className="font-medium">Payment:</span>{" "}
                          {b.paymentMethod ? b.paymentMethod === 'gcash' ? `GCash (${b.paymentReference || 'Pending'})` : 'Cash' : 'Not specified'}
                        </div>
                        {b.type === 'amenity-restaurant' && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="mt-2 flex items-center gap-1"
                            onClick={() => toggleRowExpansion(b.id)}
                          >
                            {expandedRows.includes(b.id) ? (
                              <>
                                <ChevronUp className="h-4 w-4" />
                                Hide Order Details
                              </>
                            ) : (
                              <>
                                <ChevronDown className="h-4 w-4" />
                                View Order Details
                              </>
                            )}
                          </Button>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>₱{(b.total || 0).toFixed ? (b.total).toFixed(2) : b.total}</TableCell>
                    <TableCell>{b.status || 'pending'}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        {b.status !== 'confirmed' && (
                          <button
                            className="px-2 py-1 rounded bg-emerald-600 text-white text-sm disabled:opacity-50"
                            disabled={updatingId === b.id}
                            onClick={() => updateBookingStatus(b.id, 'confirmed')}
                          >
                            {updatingId === b.id ? 'Updating...' : 'Confirm'}
                          </button>
                        )}
                        {b.status !== 'rejected' && (
                          <button
                            className="px-2 py-1 rounded bg-red-600 text-white text-sm disabled:opacity-50"
                            disabled={updatingId === b.id}
                            onClick={() => updateBookingStatus(b.id, 'rejected')}
                          >
                            {updatingId === b.id ? 'Updating...' : 'Reject'}
                          </button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                  {b.type === 'amenity-restaurant' && expandedRows.includes(b.id) && (
                    <TableRow>
                      <TableCell colSpan={7}>
                        <div className="bg-muted/50 p-4 rounded-lg">
                          <h4 className="font-medium mb-2">Order Details</h4>
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Item</TableHead>
                                <TableHead>Quantity</TableHead>
                                <TableHead>Price</TableHead>
                                <TableHead>Subtotal</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {formatOrderItems(b.items).map((item: any, index: number) => (
                                <TableRow key={index}>
                                  <TableCell>{item.name}</TableCell>
                                  <TableCell>{item.qty}</TableCell>
                                  <TableCell>₱{item.price.toFixed(2)}</TableCell>
                                  <TableCell>₱{item.subtotal.toFixed(2)}</TableCell>
                                </TableRow>
                              ))}
                              <TableRow>
                                <TableCell colSpan={3} className="text-right font-medium">Total:</TableCell>
                                <TableCell className="font-medium">₱{b.total.toFixed(2)}</TableCell>
                              </TableRow>
                            </TableBody>
                          </Table>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}