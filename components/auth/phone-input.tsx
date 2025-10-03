"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, Phone } from "lucide-react";
import toast from "react-hot-toast";

const phoneSchema = z.object({
  countryCode: z.string().min(1, "Please select a country"),
  phoneNumber: z.string().min(6, "Phone number must be at least 6 digits"),
});

type PhoneFormData = z.infer<typeof phoneSchema>;

interface Country {
  name: string;
  code: string;
  dialCode: string;
}

export default function PhoneInput({
  onSubmit,
}: {
  onSubmit: (phone: string) => void;
}) {
  const [countries, setCountries] = useState<Country[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetchingCountries, setFetchingCountries] = useState(true);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PhoneFormData>({
    resolver: zodResolver(phoneSchema),
    defaultValues: {
      countryCode: "+91",
      phoneNumber: "",
    },
  });

  useEffect(() => {
    fetch("https://restcountries.com/v3.1/region/asia")
      .then((res) => res.json())
      .then((data) => {
        const countryData: Country[] = data
          .map((country: any) => ({
            name: country.name.common,
            code: country.cca2,
            dialCode: country.idd.root
              ? `${country.idd.root}${country.idd.suffixes?.[0] || ""}`
              : "",
          }))
          .filter((c: Country) => c.dialCode)
          .sort((a: Country, b: Country) => a.name.localeCompare(b.name));
        setCountries(countryData);
        setFetchingCountries(false);
      })
      .catch(() => {
        toast.error("Failed to load countries");
        setFetchingCountries(false);
      });
  }, []);

  const handleFormSubmit = async (data: PhoneFormData) => {
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    toast.success("OTP sent successfully!");
    onSubmit(`${data.countryCode}${data.phoneNumber}`);
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-muted-foreground mb-2">
          Country Code
        </label>
        <select
          {...register("countryCode")}
          disabled={fetchingCountries}
          className="w-full px-4 py-3 bg-none rounded-lg  border-black border focus:ring-2 focus:ring-none  focus:border-transparent disabled:opacity-50"
        >
          {fetchingCountries ? (
            <option>Loading countries...</option>
          ) : (
            countries.map((country) => (
              <option key={country.code} value={country.dialCode} className="bg-black text-white">
                {country.name} ({country.dialCode})
              </option>
            ))
          )}
        </select>
        {errors.countryCode && (
          <p className="mt-1 text-sm text-red-600">{errors.countryCode.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-muted-foreground mb-2">
          Phone Number
        </label>
        <div className="relative">
          <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
          <input
            {...register("phoneNumber")}
            type="tel"
            placeholder="Enter your phone number"
            className="w-full pl-10 pr-4 py-3 border bg-input border-black rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent"
          />
        </div>
        {errors.phoneNumber && (
          <p className="mt-1 text-sm text-red-600">{errors.phoneNumber.message}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={loading || fetchingCountries}
        className="w-full bg-primary text-primary-foreground py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
      >
        {loading ? (
          <>
            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
            Sending OTP...
          </>
        ) : (
          "Send OTP"
        )}
      </button>
    </form>
  );
}