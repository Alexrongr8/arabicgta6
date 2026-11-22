/** Public editorial recovery copy only; no service key, private table, scheduling or restore. */
import { config as loadEnv } from "dotenv";
import { publicEditorialConfig, prepareEditorialOutput, readPublicEditorial, writeEditorialBackup, EditorialBackupError, editorialErrorMessage } from "./lib/public-editorial-backup";

async function main() {
  const args = process.argv.slice(2);
  if (args.length === 1 && args[0] === "--help") {
    console.log("Usage: tsx scripts/backup-editorial.ts --out=.local-backups\nManual public.items backup only. Uses the existing public Supabase URL/key. Output directory0700; data/manifest0600. Does not include accounts, community, schema or media bytes.");
    return;
  }
  if (args.length !== 1 || !args[0].startsWith("--out=") || !args[0].slice(6)) throw new EditorialBackupError("Pass one explicit output directory: --out=.local-backups");
  const output = prepareEditorialOutput(args[0].slice(6));
  loadEnv({ path: ".env.local", quiet: true }); loadEnv({ quiet: true });
  const config = publicEditorialConfig(process.env);
  const snapshot = await readPublicEditorial(config);
  const saved = writeEditorialBackup(output, snapshot);
  console.log(`Saved ${saved.rows} public articles.\nData: ${saved.jsonPath}\nManifest: ${saved.manifestPath}\nSHA256: ${saved.sha256}\nThis is an editorial backup, not a full hosted-database backup.`);
}
main().catch((error) => { console.error(editorialErrorMessage(error)); process.exitCode = 1; });
