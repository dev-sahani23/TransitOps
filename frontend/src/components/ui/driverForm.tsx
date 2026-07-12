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

interface DriverFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface DriverData {
  full_name: string;
  contact_number: string;
  email: string;
  date_of_birth: string;
  license_number: string;
  license_category: string;
  license_expiry: string;
  joining_date: string;
  status: string;
}

export default function DriverForm({
  open,
  onOpenChange,
}: DriverFormProps) {
  const [formData, setFormData] = useState<DriverData>({
    full_name: "",
    contact_number: "",
    email: "",
    date_of_birth: "",
    license_number: "",
    license_category: "",
    license_expiry: "",
    joining_date: "",
    status: "Available",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    console.log(formData);

    // axios.post("/api/drivers", formData);
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
              name="full_name"
              value={formData.full_name}
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
              name="contact_number"
              value={formData.contact_number}
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
              name="date_of_birth"
              value={formData.date_of_birth}
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
              name="license_number"
              value={formData.license_number}
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
              name="license_category"
              value={formData.license_category}
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
              name="license_expiry"
              value={formData.license_expiry}
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
              name="joining_date"
              value={formData.joining_date}
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
              <option value="Available">Available</option>
              <option value="On Trip">On Trip</option>
              <option value="Leave">Leave</option>
              <option value="Suspended">Suspended</option>
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