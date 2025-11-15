import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/redux/store';
import {
  fetchRoomTypes,
  createRoomType,
  updateRoomType,
  deleteRoomType,
} from '@/redux/slices/roomType.slice';
import { RoomType } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { ConfirmDialog } from '@/components/shared/ConfirmDialog';
import { formatCurrency } from '@/utils/formatters';
import { Plus, Pencil, Trash2 } from 'lucide-react';

const RoomTypesPage = () => {
  const dispatch = useAppDispatch();
  const { roomTypes, loading } = useAppSelector((state) => state.roomTypes);
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingRoomType, setEditingRoomType] = useState<RoomType | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    basePrice: '',
    capacity: '',
    amenities: '',
    description: '',
  });

  useEffect(() => {
    dispatch(fetchRoomTypes());
  }, [dispatch]);

  const handleOpenDialog = (roomType?: RoomType) => {
    if (roomType) {
      setEditingRoomType(roomType);
      setFormData({
        name: roomType.name,
        basePrice: roomType.basePrice.toString(),
        capacity: roomType.capacity.toString(),
        amenities: roomType.amenities.join(', '),
        description: roomType.description,
      });
    } else {
      setEditingRoomType(null);
      setFormData({
        name: '',
        basePrice: '',
        capacity: '',
        amenities: '',
        description: '',
      });
    }
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const data = {
      name: formData.name,
      basePrice: parseFloat(formData.basePrice),
      capacity: parseInt(formData.capacity),
      amenities: formData.amenities.split(',').map((a) => a.trim()).filter(Boolean),
      description: formData.description,
    };

    if (editingRoomType) {
      await dispatch(updateRoomType({ ...data, id: editingRoomType.id }));
    } else {
      await dispatch(createRoomType(data));
    }
    
    setIsDialogOpen(false);
  };

  const handleDelete = async () => {
    if (deletingId) {
      await dispatch(deleteRoomType(deletingId));
      setIsDeleteDialogOpen(false);
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Room Types</h1>
          <p className="text-muted-foreground">Manage different room categories</p>
        </div>
        <Button onClick={() => handleOpenDialog()}>
          <Plus className="mr-2 h-4 w-4" />
          Add Room Type
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Room Types</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <LoadingSpinner />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Base Price</TableHead>
                  <TableHead>Capacity</TableHead>
                  <TableHead>Amenities</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {roomTypes.map((roomType) => (
                  <TableRow key={roomType.id}>
                    <TableCell className="font-medium">{roomType.name}</TableCell>
                    <TableCell>{formatCurrency(roomType.basePrice)}</TableCell>
                    <TableCell>{roomType.capacity} guests</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {roomType.amenities.slice(0, 3).map((amenity, idx) => (
                          <span
                            key={idx}
                            className="text-xs bg-secondary px-2 py-1 rounded"
                          >
                            {amenity}
                          </span>
                        ))}
                        {roomType.amenities.length > 3 && (
                          <span className="text-xs text-muted-foreground">
                            +{roomType.amenities.length - 3} more
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleOpenDialog(roomType)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => {
                            setDeletingId(roomType.id);
                            setIsDeleteDialogOpen(true);
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Create/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingRoomType ? 'Edit Room Type' : 'Add Room Type'}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="basePrice">Base Price</Label>
                <Input
                  id="basePrice"
                  type="number"
                  step="0.01"
                  value={formData.basePrice}
                  onChange={(e) => setFormData({ ...formData, basePrice: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="capacity">Capacity</Label>
                <Input
                  id="capacity"
                  type="number"
                  value={formData.capacity}
                  onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="amenities">Amenities (comma-separated)</Label>
                <Input
                  id="amenities"
                  value={formData.amenities}
                  onChange={(e) => setFormData({ ...formData, amenities: e.target.value })}
                  placeholder="WiFi, TV, Air Conditioning"
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>
            </div>
            <DialogFooter className="mt-4">
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">
                {editingRoomType ? 'Update' : 'Create'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        title="Delete Room Type"
        description="Are you sure you want to delete this room type? This action cannot be undone."
        onConfirm={handleDelete}
        confirmText="Delete"
      />
    </div>
  );
};

export default RoomTypesPage;

