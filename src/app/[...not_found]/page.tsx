// app/[...not_found]/page.tsx

import { notFound } from "next/navigation";

export default function NotFoundCatchAll() {
    notFound();
}

export function generateStaticParams() {
    return [{ not_found: ["404"] }];
}
