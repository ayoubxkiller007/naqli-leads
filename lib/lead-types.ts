/** Re-export Lead type for visitor-store circular safety */
export type Lead = {
  id: string;
  createdAt: string;
  name: string;
  phone: string;
  city: string;
  moveType: string;
  fromArea?: string;
  toArea?: string;
  notes?: string;
  ip?: string;
  country?: string;
  status: "new" | "sent" | "sold" | "spam";
};
