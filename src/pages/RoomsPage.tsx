import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/redux/store';
import {
  fetchRooms,
  createRoom,
  updateRoom,
  deleteRoom,
  updateRoomStatus,
} from '@/redux/slices/rooms.slice';
import { fetchRoomTypes } from '@/redux/slices/roomType.slice';
import { Room, RoomStatus } from '@/types';
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
import { Plus, Pencil, Trash2, Filter } from 'lucide-react';
import { useTranslation } from '@/i18n';

const statusColors: Record<RoomStatus, string> = {
  available: 'bg-green-500',
  occupied: 'bg-red-500',
  maintenance: 'bg-yellow-500',
  cleaning: 'bg-blue-500',
};

const RoomsPage = () => {
  const { t } = useTranslation('rooms');
  const tCommon = (key: string) => t(key, { ns: 'common' });
  const dispatch = useAppDispatch();
  const { rooms, loading } = useAppSelector((state) => state.rooms);
  const { roomTypes } = useAppSelector((state) => state.roomTypes);
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState<Room | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  
  const [formData, setFormData] = useState({
    roomNumber: '',
    roomTypeId: '',
    floor: '',
    status: 'available' as RoomStatus,
  });

  useEffect(() => {
    dispatch(fetchRooms());
    dispatch(fetchRoomTypes());
  }, [dispatch]);

  const handleOpenDialog = (room?: Room) => {
    if (room) {
      setEditingRoom(room);
      setFormData({
        roomNumber: room.roomNumber,
        roomTypeId: room.roomTypeId.toString(),
        floor: room.floor.toString(),
        status: room.status,
      });
    } else {
      setEditingRoom(null);
      setFormData({
        roomNumber: '',
        roomTypeId: '',
        floor: '',
        status: 'available',
      });
    }
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const data = {
      roomNumber: formData.roomNumber,
      roomTypeId: parseInt(formData.roomTypeId),
      floor: parseInt(formData.floor),
      status: formData.status,
    };

    if (editingRoom) {
      await dispatch(updateRoom({ ...data, id: editingRoom.id }));
    } else {
      await dispatch(createRoom(data));
    }
    
    setIsDialogOpen(false);
  };

  const handleDelete = async () => {
    if (deletingId) {
      await dispatch(deleteRoom(deletingId));
      setIsDeleteDialogOpen(false);
      setDeletingId(null);
    }
  };

  const filteredRooms = rooms.filter(
    (room) => filterStatus === 'all' || room.status === filterStatus
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{t('rooms.title')}</h1>
          <p className="text-muted-foreground">{t('rooms.description')}</p>
        </div>
        <Button onClick={() => handleOpenDialog()}>
          <Plus className="mr-2 h-4 w-4" />
          {t('rooms.addButton')}
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>{t('rooms.allRooms')}</CardTitle>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder={t('rooms.filterByStatus')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t('rooms.allRooms')}</SelectItem>
                  <SelectItem value="available">{tCommon('status.available')}</SelectItem>
                  <SelectItem value="occupied">{tCommon('status.occupied')}</SelectItem>
                  <SelectItem value="cleaning">{tCommon('status.cleaning')}</SelectItem>
                  <SelectItem value="maintenance">{tCommon('status.maintenance')}</SelectItem>
                </SelectContent>
              </Select>
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
                  <TableHead>{t('rooms.table.roomNumber')}</TableHead>
                  <TableHead>{t('rooms.table.type')}</TableHead>
                  <TableHead>{t('rooms.table.floor')}</TableHead>
                  <TableHead>{t('rooms.table.status')}</TableHead>
                  <TableHead>{tCommon('actions')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRooms.map((room) => {
                  const roomType = roomTypes.find((rt) => rt.id === room.roomTypeId);
                  return (
                    <TableRow key={room.id}>
                      <TableCell className="font-medium">{room.roomNumber}</TableCell>
                      <TableCell>{roomType?.name || 'Unknown'}</TableCell>
                      <TableCell>{t('rooms.table.floor')} {room.floor}</TableCell>
                      <TableCell>
                        <Badge className={statusColors[room.status]}>
                          {tCommon(`status.${room.status}`)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleOpenDialog(room)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => {
                              setDeletingId(room.id);
                              setIsDeleteDialogOpen(true);
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
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

      {/* Create/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingRoom ? t('rooms.dialog.edit') : t('rooms.dialog.add')}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <Label htmlFor="roomNumber">{t('rooms.form.roomNumber')}</Label>
                <Input
                  id="roomNumber"
                  value={formData.roomNumber}
                  onChange={(e) => setFormData({ ...formData, roomNumber: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="roomTypeId">{t('rooms.form.roomType')}</Label>
                <Select
                  value={formData.roomTypeId}
                  onValueChange={(value) => setFormData({ ...formData, roomTypeId: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t('rooms.form.selectRoomType')} />
                  </SelectTrigger>
                  <SelectContent>
                    {roomTypes.map((type) => (
                      <SelectItem key={type.id} value={type.id.toString()}>
                        {type.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="floor">{t('rooms.form.floor')}</Label>
                <Input
                  id="floor"
                  type="number"
                  value={formData.floor}
                  onChange={(e) => setFormData({ ...formData, floor: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="status">{t('rooms.form.status')}</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => setFormData({ ...formData, status: value as RoomStatus })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="available">{tCommon('status.available')}</SelectItem>
                    <SelectItem value="occupied">{tCommon('status.occupied')}</SelectItem>
                    <SelectItem value="cleaning">{tCommon('status.cleaning')}</SelectItem>
                    <SelectItem value="maintenance">{tCommon('status.maintenance')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter className="mt-4">
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                {tCommon('buttons.cancel')}
              </Button>
              <Button type="submit">{editingRoom ? tCommon('buttons.update') : tCommon('buttons.create')}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        title={t('rooms.delete.title')}
        description={t('rooms.delete.description')}
        onConfirm={handleDelete}
        confirmText={tCommon('buttons.delete')}
      />
    </div>
  );
};

export default RoomsPage;
