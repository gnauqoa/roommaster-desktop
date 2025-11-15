import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/redux/store';
import { createRentalSlip, fetchRentalSlips } from '@/redux/slices/check.slice';
import { fetchReservations } from '@/redux/slices/reservations.slice';
import { fetchRooms } from '@/redux/slices/rooms.slice';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { formatDate, getTodayString } from '@/utils/dateHelpers';
import { LogIn, Search } from 'lucide-react';

const CheckInPage = () => {
  const dispatch = useAppDispatch();
  const { loading } = useAppSelector((state) => state.checkIn);
  const { reservations } = useAppSelector((state) => state.reservations);
  const { rooms } = useAppSelector((state) => state.rooms);
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState<any>(null);
  const [deposit, setDeposit] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    dispatch(fetchReservations());
    dispatch(fetchRooms());
    dispatch(fetchRentalSlips());
  }, [dispatch]);

  const todayReservations = reservations.filter(
    (res) =>
      res.checkInDate === getTodayString() &&
      (res.status === 'confirmed' || res.status === 'pending')
  );

  const filteredReservations = todayReservations.filter(
    (res) =>
      res.guestName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      res.guestId.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCheckIn = (reservation: any) => {
    setSelectedReservation(reservation);
    setDeposit('100');
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (selectedReservation) {
      await dispatch(
        createRentalSlip({
          reservationId: selectedReservation.id,
          guestName: selectedReservation.guestName,
          roomId: selectedReservation.roomId,
          deposit: parseFloat(deposit),
        })
      );
      
      setIsDialogOpen(false);
      dispatch(fetchReservations());
      dispatch(fetchRooms());
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Check-in</h1>
        <p className="text-muted-foreground">Process guest check-ins</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Today's Expected Check-ins</CardTitle>
            <div className="flex items-center gap-2">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by guest name or ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-64"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <LoadingSpinner />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Guest Name</TableHead>
                  <TableHead>Guest ID</TableHead>
                  <TableHead>Room</TableHead>
                  <TableHead>Check-in Date</TableHead>
                  <TableHead>Check-out Date</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredReservations.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center text-muted-foreground">
                      No check-ins scheduled for today
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredReservations.map((reservation) => {
                    const room = rooms.find((r) => r.id === reservation.roomId);
                    return (
                      <TableRow key={reservation.id}>
                        <TableCell className="font-medium">{reservation.guestName}</TableCell>
                        <TableCell>{reservation.guestId}</TableCell>
                        <TableCell>{room?.roomNumber || 'N/A'}</TableCell>
                        <TableCell>{formatDate(reservation.checkInDate)}</TableCell>
                        <TableCell>{formatDate(reservation.checkOutDate)}</TableCell>
                        <TableCell>{reservation.phone}</TableCell>
                        <TableCell>
                          <Button size="sm" onClick={() => handleCheckIn(reservation)}>
                            <LogIn className="mr-2 h-4 w-4" />
                            Check In
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

      {/* Check-in Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Process Check-in</DialogTitle>
          </DialogHeader>
          {selectedReservation && (
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <Label>Guest Name</Label>
                  <Input value={selectedReservation.guestName} disabled />
                </div>
                <div>
                  <Label>Room Number</Label>
                  <Input
                    value={
                      rooms.find((r) => r.id === selectedReservation.roomId)?.roomNumber || 'N/A'
                    }
                    disabled
                  />
                </div>
                <div>
                  <Label>Deposit Amount</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={deposit}
                    onChange={(e) => setDeposit(e.target.value)}
                    required
                  />
                </div>
                <div className="text-sm text-muted-foreground">
                  <p>Check-in: {formatDate(selectedReservation.checkInDate)}</p>
                  <p>Check-out: {formatDate(selectedReservation.checkOutDate)}</p>
                </div>
              </div>
              <DialogFooter className="mt-4">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Complete Check-in</Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CheckInPage;

