/**
 * Renders schema.org JSON-LD. `<` is escaped so CMS text (FAQ answers, article titles) can never
 * close the script tag early.
 */
const JsonLd = ({ data }: { data: object | null | undefined }) =>
  data ? (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, '\\u003c') }}
    />
  ) : null

export default JsonLd
