import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";
import { useQueryClient } from "@tanstack/react-query";

interface DriverFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface DriverData {
  name: string;
  phone: string;
  email: string;
  dateOfBirth: string;
  licenseNumber: string;
  licenseCategory: string;
  licenseExpiry: string;
  joiningDate: string;
  status: string;
}

export default function DriverForm({
  open,
  onOpenChange,
}: DriverFormProps) {
  const [formData, setFormData] = useState<DriverData>({
    name: "",
    phone: "",
    email: "",
    dateOfBirth: "",
    licenseNumber: "",
    licenseCategory: "",
    licenseExpiry: "",
    joiningDate: "",
    status: "AVAILABLE",
  });
  const qc = useQueryClient();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await api.post("/drivers", formData);
      qc.invalidateQueries({ queryKey: ["drivers"] });
      onOpenChange(false);
    } catch (error: any) {
      console.error("Failed to submit driver form", error);
      alert(error.response?.data?.message || error.response?.data?.errors?.[0]?.message || "Failed to submit form");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl bg-[#131C27] border border-[#273343] text-white rounded-2xl p-8">

        <DialogHeader>

          <DialogTitle className="text-3xl font-bold">
            Add Driver
          </DialogTitle>

          <p className="text-sm text-slate-400 mt-2">
            Register a new driver into TransitOps
          </p>

        </DialogHeader>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6"
        >
          {/* Full Name */}

          <div>
            <Label className="mb-2 block">
              Full Name
            </Label>

            <Input
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter full name"
              className="bg-[#1B2432] border-[#334155] h-11"
            />
          </div>

          {/* Contact */}

          <div>
            <Label className="mb-2 block">
              Contact Number
            </Label>

            <Input
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="9876543210"
              className="bg-[#1B2432] border-[#334155] h-11"
            />
          </div>

          {/* Email */}

          <div>
            <Label className="mb-2 block">
              Email
            </Label>

            <Input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="driver@email.com"
              className="bg-[#1B2432] border-[#334155] h-11"
            />
          </div>

          {/* DOB */}

          <div>
            <Label className="mb-2 block">
              Date of Birth
            </Label>

            <Input
              type="date"
              name="dateOfBirth"
              value={formData.dateOfBirth}
              onChange={handleChange}
              className="bg-[#1B2432] border-[#334155] h-11"
            />
          </div>

          {/* License Number */}

          <div>
            <Label className="mb-2 block">
              License Number
            </Label>

            <Input
              name="licenseNumber"
              value={formData.licenseNumber}
              onChange={handleChange}
              placeholder="DL0123456789"
              className="bg-[#1B2432] border-[#334155] h-11"
            />
          </div>

          {/* License Category */}

          <div>
            <Label className="mb-2 block">
              License Category
            </Label>

            <select
              name="licenseCategory"
              value={formData.licenseCategory}
              onChange={handleChange}
              className="w-full h-11 rounded-md border border-[#334155] bg-[#1B2432] px-3 text-white"
            >
              <option value="">Select Category</option>
              <option value="LMV">LMV</option>
              <option value="HMV">HMV</option>
              <option value="Transport">Transport</option>
              <option value="Heavy Transport">Heavy Transport</option>
            </select>
          </div>          {/* License Expiry */}

          <div>
            <Label className="mb-2 block">
              License Expiry
            </Label>

            <Input
              type="date"
              name="licenseExpiry"
              value={formData.licenseExpiry}
              onChange={handleChange}
              className="bg-[#1B2432] border-[#334155] h-11"
            />
          </div>

          {/* Joining Date */}

          <div>
            <Label className="mb-2 block">
              Joining Date
            </Label>

            <Input
              type="date"
              name="joiningDate"
              value={formData.joiningDate}
              onChange={handleChange}
              className="bg-[#1B2432] border-[#334155] h-11"
            />
          </div>

          {/* Driver Status */}

          <div>
            <Label className="mb-2 block">
              Status
            </Label>

            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full h-11 rounded-md border border-[#334155] bg-[#1B2432] px-3 text-white"
            >
              <option value="AVAILABLE">Available</option>
              <option value="ON_TRIP">On Trip</option>
              <option value="OFF_DUTY">Leave</option>
              <option value="SUSPENDED">Suspended</option>
            </select>
          </div>

          {/* Empty column for alignment */}

          <div></div>

          {/* Buttons */}

          <div className="md:col-span-2 flex justify-end gap-4 mt-4">

            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="border-[#334155] bg-transparent text-white hover:bg-[#1B2432]"
            >
              Cancel
            </Button>

            <Button
              type="submit"
              className="bg-primary text-black hover:bg-primary/90 px-8"
            >
              Save Driver
            </Button>

          </div>

        </form>

      </DialogContent>

    </Dialog>
  );
}