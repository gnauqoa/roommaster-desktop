export interface RoomType {
  id: number;
  name: string;
  basePrice: number;
  capacity: number;
  amenities: string[];
  description: string;
}

export type RoomStatus = 'available' | 'occupied' | 'maintenance' | 'cleaning';

export interface Room {
  id: number;
  roomNumber: string;
  roomTypeId: number;
  status: RoomStatus;
  floor: number;
}

export interface RoomWithType extends Room {
  roomType?: RoomType;
}

export interface CreateRoomInput {
  roomNumber: string;
  roomTypeId: number;
  status: RoomStatus;
  floor: number;
}

export interface UpdateRoomInput extends Partial<CreateRoomInput> {
  id: number;
}

export interface RoomFilters {
  status?: RoomStatus;
  roomTypeId?: number;
  floor?: number;
}

