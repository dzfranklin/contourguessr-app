import iconAttribution from "@/icon_attribution.yaml";
import licenseReport from "@/license_report.json";

export default function AttributionPage() {
  return (
    <div className="prose m-5 max-w-4xl">
      <h1>Attribution</h1>
      <ul>
        <li>
          Includes data derived from OpenStreetMap. © OpenStreetMap contributors{" "}
          <a href="https://www.openstreetmap.org/copyright">
            openstreetmap.org/copyright
          </a>
          . Licensed under the{" "}
          <a href="https://opendatacommons.org/licenses/odbl/">ODbL</a>. The
          derivation process is publicly available at{" "}
          <a href="https://github.com/dzfranklin/contourguessr-ingest">
            github.com/contourguessr-ingest
          </a>
          .
        </li>
        {iconAttribution.map((html: string, i: number) => (
          <li key={i} dangerouslySetInnerHTML={{ __html: html }} />
        ))}

        {licenseReport.map((report, i) => (
          <li key={i}>
            <span>{report.name} </span>
            <span>{report.installedVersion} </span>
            <span>by {report.author} </span>
            <span>({report.licenseType})</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
