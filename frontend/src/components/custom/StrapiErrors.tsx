interface StrapiErrorsProps {
  message: string | null;
  name: string;
  status: string | null;
}

export function StrapiErrors({ error }: { readonly error: StrapiErrorsProps }) {
  if (!error?.message) return null;
  return <div className=" text-sm  text-rose-600 py-2">{error.message}</div>;
}
