// Shared plain-input field for the account login/signup forms
// (app/account/login, app/account/signup) — these pages sit outside the
// festival theme wrapper (no primary-*/accent-* CSS vars in scope), so
// this uses the brand's maroon/gold hex directly instead.
export default function AuthField({
  label,
  name,
  type,
  required,
}: {
  label: string;
  name: string;
  type: string;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="text-xs font-semibold text-[#7A1F2B]/80 mb-1 block">{label}</span>
      <input
        name={name}
        type={type}
        required={required}
        className="w-full rounded-lg border border-[#D4A017]/40 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#D4A017]"
      />
    </label>
  );
}
