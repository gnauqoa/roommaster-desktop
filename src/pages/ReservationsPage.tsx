import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/redux/store';
import {
  fetchReservations,
  createReservation,
  updateReservation,
  cancelReservation,
  searchAvailability,
} from '@/redux/slices/reservations.slice';
import { fetchRooms } from '@/redux/slices/rooms.slice';
import { fetchRoomTypes } from '@/redux/slices/roomType.slice';
import { Reservation } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { ConfirmDialog } from '@/components/shared/ConfirmDialog';
import { formatDate } from '@/utils/dateHelpers';
import { Plus, Search, Pencil, XCircle } from 'lucide-react';

const ReservationsPage = () => {
  const dispatch = useAppDispatch();
  const { reservations, availableRooms, loading } = useAppSelector((state) => state.reservations);
  const { rooms } = useAppSelector((state) => state.rooms);
  const { roomTypes } = useAppSelector((state) => state.roomTypes);
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [editingReservation, setEditingReservation] = useState<Reservation | null>(null);
  const [cancelingId, setCancelingId] = useState<number | null>(null);
  
  const [searchData, setSearchData] = useState({
    checkInDate: '',
    checkOutDate: '',
    roomTypeId: '',
  });
  
  const [formData, setFormData] = useState({
    guestName: '',
    guestId: '',
    phone: '',
    email: '',
    roomId: '',
    checkInDate: '',
    checkOutDate: '',
    notes: '',
  });

  useEffect(() => {
    dispatch(fetchReservations());
    dispatch(fetchRooms());
    dispatch(fetchRoomTypes());
  }, [dispatch]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    await dispatch(searchAvailability(searchData as any));
  };

  const handleOpenDialog = (reservation?: Reservation) => {
    if (reservation) {
      setEditingReservation(reservation);
      setFormData({
        guestName: reservation.guestName,
        guestId: reservation.guestId,
        phone: reservation.phone,
        email: reservation.email,
        roomId: reservation.roomId.toString(),
        checkInDate: reservation.checkInDate,
        checkOutDate: reservation.checkOutDate,
        notes: reservation.notes,
      });
    } else {
      setEditingReservation(null);
      setFormData({
        guestName: '',
        guestId: '',
        phone: '',
        email: '',
        roomId: '',
        checkInDate: '',
        checkOutDate: '',
        notes: '',
      });
    }
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const data = {
      ...formData,
      roomId: parseInt(formData.roomId),
    };

    if (editingReservation) {
      await dispatch(updateReservation({ ...data, id: editingReservation.id }));
    } else {
      await dispatch(createReservation(data));
    }
    
    setIsDialogOpen(false);
    dispatch(fetchReservations());
  };

  const handleCancel = async () => {
    if (cancelingId) {
      await dispatch(cancelReservation(cancelingId));
      setIsCancelDialogOpen(false);
      setCancelingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Reservations</h1>
          <p className="text-muted-foreground">Manage room reservations</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setIsSearchOpen(true)}>
            <Search className="mr-2 h-4 w-4" />
            Search Availability
          </Button>
          <Button onClick={() => handleOpenDialog()}>
            <Plus className="mr-2 h-4 w-4" />
            New Reservation
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Reservations</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <LoadingSpinner />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Guest Name</TableHead>
                  <TableHead>Room</TableHead>
                  <TableHead>Check-in</TableHead>
                  <TableHead>Check-out</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reservations.map((reservation) => {
                  const room = rooms.find((r) => r.id === reservation.roomId);
                  return (
                    <TableRow key={reservation.id}>
                      <TableCell className="font-medium">{reservation.guestName}</TableCell>
                      <TableCell>{room?.roomNumber || 'N/A'}</TableCell>
                      <TableCell>{formatDate(reservation.checkInDate)}</TableCell>
                      <TableCell>{formatDate(reservation.checkOutDate)}</TableCell>
                      <TableCell>
                        <Badge
                          className={
                            reservation.status === 'confirmed'
                              ? 'bg-green-500'
                              : reservation.status === 'pending'
                              ? 'bg-yellow-500'
                              : 'bg-gray-500'
                          }
                        >
                          {reservation.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleOpenDialog(reservation)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          {reservation.status !== 'cancelled' && (
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => {
                                setCancelingId(reservation.id);
                                setIsCancelDialogOpen(true);
                              }}
                            >
                              <XCircle className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Search Availability Dialog */}
      <Dialog open={isSearchOpen} onOpenChange={setIsSearchOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Search Available Rooms</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSearch}>
            <div className="space-y-4">
              <div>
                <Label>Check-in Date</Label>
                <Input
                  type="date"
                  value={searchData.checkInDate}
                  onChange={(e) => setSearchData({ ...searchData, checkInDate: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label>Check-out Date</Label>
                <Input
                  type="date"
                  value={searchData.checkOutDate}
                  onChange={(e) => setSearchData({ ...searchData, checkOutDate: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label>Room Type (Optional)</Label>
                <Select
                  value={searchData.roomTypeId}
                  onValueChange={(value) => setSearchData({ ...searchData, roomTypeId: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Any type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Any type</SelectItem>
                    {roomTypes.map((type) => (
                      <SelectItem key={type.id} value={type.id.toString()}>
                        {type.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {availableRooms.length > 0 && (
                <div>
                  <Label>Available Rooms ({availableRooms.length})</Label>
                  <div className="mt-2 space-y-1">
                    {availableRooms.map((room) => (
                      <div key={room.id} className="text-sm">
                        Room {room.roomNumber} - Floor {room.floor}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <DialogFooter className="mt-4">
              <Button type="button" variant="outline" onClick={() => setIsSearchOpen(false)}>
                Close
              </Button>
              <Button type="submit">Search</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Create/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editingReservation ? 'Edit Reservation' : 'New Reservation'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Guest Name</Label>
                <Input
                  value={formData.guestName}
                  onChange={(e) => setFormData({ ...formData, guestName: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label>Guest ID</Label>
                <Input
                  value={formData.guestId}
                  onChange={(e) => setFormData({ ...formData, guestId: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label>Phone</Label>
                <Input
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label>Email</Label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label>Room</Label>
                <Select
                  value={formData.roomId}
                  onValueChange={(value) => setFormData({ ...formData, roomId: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select room" />
                  </SelectTrigger>
                  <SelectContent>
                    {rooms.filter(r => r.status === 'available').map((room) => (
                      <SelectItem key={room.id} value={room.id.toString()}>
                        Room {room.roomNumber}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Check-in Date</Label>
                <Input
                  type="date"
                  value={formData.checkInDate}
                  onChange={(e) => setFormData({ ...formData, checkInDate: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label>Check-out Date</Label>
                <Input
                  type="date"
                  value={formData.checkOutDate}
                  onChange={(e) => setFormData({ ...formData, checkOutDate: e.target.value })}
                  required
                />
              </div>
              <div className="col-span-2">
                <Label>Notes</Label>
                <Input
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                />
              </div>
            </div>
            <DialogFooter className="mt-4">
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">{editingReservation ? 'Update' : 'Create'}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Cancel Confirmation Dialog */}
      <ConfirmDialog
        open={isCancelDialogOpen}
        onOpenChange={setIsCancelDialogOpen}
        title="Cancel Reservation"
        description="Are you sure you want to cancel this reservation?"
        onConfirm={handleCancel}
        confirmText="Cancel Reservation"
      />
    </div>
  );
};

export default ReservationsPage;

