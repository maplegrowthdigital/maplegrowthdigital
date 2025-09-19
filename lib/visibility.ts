import { createAnonServerClient } from "../utils/supabase/server";

export async function getSectionVisibility(): Promise<Record<string, boolean>> {
  try {
    const supabase = createAnonServerClient();
    const { data, error } = await supabase
      .from("sections")
      .select("data")
      .eq("id", "sectionVisibility")
      .single();

    if (!error && data?.data) {
      return data.data as Record<string, boolean>;
    }
  } catch (error) {
    console.log("Could not fetch section visibility, using defaults");
  }

  // Default visibility - all sections visible except those explicitly hidden
  return {};
}

export function isSectionVisible(
  sectionKey: string,
  visibility: Record<string, boolean>
): boolean {
  // Default to visible if not explicitly set to false
  return visibility[sectionKey] !== false;
}
