import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/redux/store';
import { calculateCheckout, processCheckout } from '@/redux/slices/checkOut.slice';
import { fetchRooms } from '@/redux/slices/rooms.slice';
import { fetchRentalSlips } from '@/redux/slices/check.slice';
import { fetchServices } from '@/redux/slices/services.slice';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { formatCurrency } from '@/utils/formatters';
import { LogOut } from 'lucide-react';

const CheckOutPage = () => {
  const dispatch = useAppDispatch();
  const { checkoutData, loading } = useAppSelector((state) => state.checkOut);
  const { rooms } = useAppSelector((state) => state.rooms);
  const { rentalSlips } = useAppSelector((state) => state.checkIn);
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedRoomId, setSelectedRoomId] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'credit_card' | 'debit_card' | 'bank_transfer'>('cash');

  useEffect(() => {
    dispatch(fetchRooms());
    dispatch(fetchRentalSlips());
    dispatch(fetchServices());
  }, [dispatch]);

  const occupiedRooms = rooms.filter((r) => r.status === 'occupied');

  const handleSelectRoom = async (roomId: string) => {
    setSelectedRoomId(roomId);
    const rentalSlip = rentalSlips.find((rs) => rs.roomId === parseInt(roomId));
    if (rentalSlip) {
      await dispatch(calculateCheckout(rentalSlip.id));
      setIsDialogOpen(true);
    }
  };

  const handleCheckout = async () => {
    const rentalSlip = rentalSlips.find((rs) => rs.roomId === parseInt(selectedRoomId));
    if (rentalSlip) {
      await dispatch(processCheckout({ rentalSlipId: rentalSlip.id, paymentMethod }));
      setIsDialogOpen(false);
      dispatch(fetchRooms());
      dispatch(fetchRentalSlips());
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Check-out</h1>
        <p className="text-muted-foreground">Process guest check-outs and generate invoices</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Occupied Rooms</CardTitle>
        </CardHeader>
        <CardContent>
          {loading && !checkoutData ? (
            <LoadingSpinner />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Room Number</TableHead>
                  <TableHead>Floor</TableHead>
                  <TableHead>Guest</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {occupiedRooms.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center text-muted-foreground">
                      No occupied rooms
                    </TableCell>
                  </TableRow>
                ) : (
                  occupiedRooms.map((room) => {
                    const rentalSlip = rentalSlips.find((rs) => rs.roomId === room.id);
                    return (
                      <TableRow key={room.id}>
                        <TableCell className="font-medium">{room.roomNumber}</TableCell>
                        <TableCell>Floor {room.floor}</TableCell>
                        <TableCell>{rentalSlip?.guestName || 'N/A'}</TableCell>
                        <TableCell>
                          <Button size="sm" onClick={() => handleSelectRoom(room.id.toString())}>
                            <LogOut className="mr-2 h-4 w-4" />
                            Check Out
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Checkout Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Process Check-out</DialogTitle>
          </DialogHeader>
          {checkoutData ? (
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold">Guest Information</h3>
                <p className="text-sm text-muted-foreground">{checkoutData.rentalSlip.guestName}</p>
              </div>

              <Separator />

              <div className="space-y-2">
                <h3 className="font-semibold">Bill Summary</h3>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>Room Charges</span>
                    <span>{formatCurrency(checkoutData.roomCharges)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Service Charges</span>
                    <span>{formatCurrency(checkoutData.serviceCharges)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax (10%)</span>
                    <span>{formatCurrency(checkoutData.tax)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-semibold">
                    <span>Total Amount</span>
                    <span>{formatCurrency(checkoutData.totalAmount)}</span>
                  </div>
                  <div className="flex justify-between text-green-600">
                    <span>Deposit Refund</span>
                    <span>{formatCurrency(Math.abs(checkoutData.depositRefund))}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-lg font-bold">
                    <span>Final Amount</span>
                    <span>{formatCurrency(checkoutData.finalAmount)}</span>
                  </div>
                </div>
              </div>

              {checkoutData.services.length > 0 && (
                <>
                  <Separator />
                  <div>
                    <h3 className="font-semibold mb-2">Services Used</h3>
                    <div className="space-y-1 text-sm">
                      {checkoutData.services.map((service, idx) => (
                        <div key={idx} className="flex justify-between">
                          <span>Service (Qty: {service.quantity})</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}

              <Separator />

              <div>
                <label className="text-sm font-medium">Payment Method</label>
                <Select value={paymentMethod} onValueChange={(value: any) => setPaymentMethod(value)}>
                  <SelectTrigger className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cash">Cash</SelectItem>
                    <SelectItem value="credit_card">Credit Card</SelectItem>
                    <SelectItem value="debit_card">Debit Card</SelectItem>
                    <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          ) : (
            <LoadingSpinner />
          )}
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCheckout} disabled={loading}>
              {loading ? <LoadingSpinner size="sm" /> : 'Complete Check-out'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CheckOutPage;

