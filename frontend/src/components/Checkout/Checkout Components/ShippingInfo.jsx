import { Country, State } from "country-state-city";
import { IoLocationOutline } from "react-icons/io5";
import { IoIosArrowDown } from "react-icons/io";

// These two variables hold the class names, so we do not repeat them for every field
const labelClass = "block text-label-md text-on-surface-variant mb-1.5";
const inputClass =
  "appearance-none block w-full px-4 py-2.5 text-body-md bg-surface-container-low hover:bg-surface-container focus:bg-surface-container-lowest text-on-surface placeholder:text-secondary rounded-xl border border-surface-container-high focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all duration-200";

const ShippingInfo = ({
  user,
  country,
  setCountry,
  city,
  setCity,
  userInfo,
  setUserInfo,
  address1,
  setAddress1,
  address2,
  setAddress2,
  zipCode,
  setZipCode,
}) => {
  return (
    <div className="w-full bg-surface-container-lowest rounded-3xl border border-surface-container/80 shadow-[0_12px_36px_-12px_rgba(70,72,212,0.14)] p-5 sm:p-8 font-jakarta">
      {/* Section title */}
      <div className="border-b border-surface-container pb-5 mb-6 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 shrink-0 rounded-xl bg-primary-fixed/60 text-primary flex items-center justify-center">
            <IoLocationOutline size={22} />
          </div>
          <div>
            <h5 className="text-headline-sm text-on-surface tracking-tight">
              Shipping Address
            </h5>
            <p className="text-body-sm text-secondary mt-0.5">
              Please enter your delivery details to calculate shipping and
              taxes.
            </p>
          </div>
        </div>
        <span className="hidden sm:inline-flex items-center gap-1.5 shrink-0 text-label-sm px-2.5 py-1 rounded-md bg-surface-container text-on-surface-variant">
          <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
          Step 1 of 3
        </span>
      </div>

      {/* Form */}
      <form className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {/* Name */}
        <div>
          <label className={labelClass}>Full Name</label>
          <input
            type="text"
            value={user && user.name}
            required
            className={inputClass}
          />
        </div>

        {/* Email */}
        <div>
          <label className={labelClass}>Email Address</label>
          <input
            type="text"
            value={user && user.email}
            required
            className={inputClass}
          />
        </div>

        {/* Phone Number */}
        <div>
          <label className={labelClass}>Phone Number</label>
          <input
            type="number"
            required
            value={user && user.phoneNumber}
            className={inputClass}
          />
        </div>

        {/* Zip code */}
        <div>
          <label className={labelClass}>Zip Code</label>
          <input
            type="number"
            value={zipCode}
            onChange={(e) => setZipCode(e.target.value)}
            required
            className={inputClass}
          />
        </div>

        {/* country */}
        <div>
          <label className={labelClass}>Country</label>
          <div className="relative">
            <select
              className={`${inputClass} pr-10 cursor-pointer`}
              value={country}
              onChange={(e) => setCountry(e.target.value)}
            >
              <option className="block pb-2">Choose your Country</option>
              {Country &&
                Country.getAllCountries().map((item) => (
                  <option key={item.isoCode} value={item.isoCode}>
                    {item.name}
                  </option>
                ))}
            </select>
            <IoIosArrowDown
              className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-secondary"
              size={16}
            />
          </div>
        </div>

        {/* city */}
        <div>
          <label className={labelClass}>City</label>
          <div className="relative">
            <select
              className={`${inputClass} pr-10 cursor-pointer`}
              value={city}
              onChange={(e) => setCity(e.target.value)}
            >
              <option className="block pb-2" value="">
                Choose your City
              </option>
              {State &&
                State.getStatesOfCountry(country).map((item) => (
                  <option key={item.isoCode} value={item.isoCode}>
                    {item.name}
                  </option>
                ))}
            </select>
            <IoIosArrowDown
              className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-secondary"
              size={16}
            />
          </div>
        </div>

        {/* address 1 */}
        <div>
          <label className={labelClass}>Address 1</label>
          <input
            type="address"
            required
            placeholder="Street name, suite, apt"
            value={address1}
            onChange={(e) => setAddress1(e.target.value)}
            className={inputClass}
          />
        </div>

        {/* address 2 */}
        <div>
          <label className={labelClass}>Address 2</label>
          <input
            type="address"
            placeholder="Apartment, suite, or unit"
            value={address2}
            onChange={(e) => setAddress2(e.target.value)}
            required
            className={inputClass}
          />
        </div>
      </form>

      {/* Choose from saved address */}
      <div className="mt-6">
        <h5
          className="inline-flex items-center gap-1.5 text-label-md text-primary hover:text-primary-container cursor-pointer transition-colors"
          onClick={() => setUserInfo(!userInfo)}
        >
          Choose from saved address
          <IoIosArrowDown
            className={`transition-transform duration-200 ${
              userInfo ? "rotate-180" : ""
            }`}
          />
        </h5>
        {userInfo && (
          <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-3">
            {user &&
              user.addresses.map((item, index) => (
                <label
                  className="flex items-center gap-3 p-3.5 rounded-xl border border-surface-variant/60 bg-surface-container-low/60 hover:bg-primary-fixed/40 hover:border-primary-fixed cursor-pointer transition-all duration-200"
                >
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-outline-variant text-primary focus:ring-primary/40 cursor-pointer"
                    value={item.addressType}
                    onClick={() =>
                      setAddress1(item.address1) ||
                      setAddress2(item.address2) ||
                      setZipCode(item.zipCode) ||
                      setCountry(item.country) ||
                      setCity(item.city)
                    }
                  />
                  <h2 className="text-label-md text-on-surface">
                    {item.addressType}
                  </h2>
                </label>
              ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ShippingInfo;