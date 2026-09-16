import { createClient } from "@supabase/supabase-js";
import configFile from "./supabase-config.json";

// Retrieve URL & key from environment variables or json config
const supabaseUrl =
  process.env.REACT_APP_SUPABASE_URL ||
  process.env.SUPABASE_URL ||
  configFile.supabaseUrl ||
  "";

const supabaseAnonKey =
  process.env.REACT_APP_SUPABASE_ANON_KEY ||
  process.env.SUPABASE_ANON_KEY ||
  configFile.supabaseAnonKey ||
  "";

export const isConfigured = Boolean(
  supabaseUrl &&
    supabaseAnonKey &&
    !supabaseUrl.includes("placeholder") &&
    !supabaseUrl.includes("YOUR_")
);

export const supabase = isConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

const SETTINGS_ROW_ID = "content";

/**
 * Validate Supabase connection and check if table exists
 */
export async function checkSupabaseStatus() {
  if (!isConfigured || !supabase) {
    return {
      configured: false,
      tableReady: false,
      message: "Supabase credentials are not configured in src/supabase-config.json",
    };
  }

  try {
    const { error } = await supabase
      .from("site_settings")
      .select("id")
      .limit(1);

    if (error) {
      if (error.code === "PGRST205" || error.message?.includes("site_settings")) {
        return {
          configured: true,
          tableReady: false,
          code: "PGRST205",
          message:
            "Connected to your Supabase project! Next step: Run the SQL script from supabase-schema.sql in your Supabase SQL Editor to create the 'site_settings' table.",
        };
      }
      return {
        configured: true,
        tableReady: false,
        code: error.code,
        message: error.message,
      };
    }

    return {
      configured: true,
      tableReady: true,
      message: "Connected to Supabase and 'site_settings' table is ready.",
    };
  } catch (err) {
    return {
      configured: true,
      tableReady: false,
      message: err?.message || "Unknown error connecting to Supabase",
    };
  }
}

export async function testConnection() {
  const status = await checkSupabaseStatus();
  if (status.configured && !status.tableReady) {
    console.warn("Supabase Notice:", status.message);
  } else if (status.tableReady) {
    console.log("Supabase connected successfully.");
  }
  return status.tableReady;
}

/**
 * Load site data from Supabase
 */
export async function loadSiteDataFromSupabase() {
  if (!isConfigured || !supabase) {
    return null;
  }

  try {
    const { data, error } = await supabase
      .from("site_settings")
      .select("content_json")
      .eq("id", SETTINGS_ROW_ID)
      .maybeSingle();

    if (error) {
      console.warn("Failed to load from Supabase:", error.message);
      return null;
    }

    if (data && data.content_json) {
      return typeof data.content_json === "string"
        ? JSON.parse(data.content_json)
        : data.content_json;
    }
  } catch (err) {
    console.warn("Failed to parse site data from Supabase:", err);
  }
  return null;
}

/**
 * Save site data to Supabase
 */
export async function saveSiteDataToSupabase(siteData) {
  // Always update local cache so changes are never lost in browser
  try {
    localStorage.setItem("clg_site_content_v1", JSON.stringify(siteData));
  } catch (e) {}

  if (!isConfigured || !supabase) {
    return {
      success: true,
      note: "Saved locally (Supabase credentials not configured in src/supabase-config.json)",
    };
  }

  try {
    const payload = {
      id: SETTINGS_ROW_ID,
      content_json: JSON.stringify(siteData),
      updated_at: new Date().toISOString(),
    };

    const { error } = await supabase
      .from("site_settings")
      .upsert(payload, { onConflict: "id" });

    if (error) {
      console.error("Error saving site data to Supabase:", error);
      return {
        success: false,
        error,
        tableMissing: error.code === "PGRST205",
        message:
          error.code === "PGRST205"
            ? "Table 'site_settings' not created yet in Supabase SQL Editor. Run supabase-schema.sql to create it."
            : error.message,
      };
    }

    return { success: true };
  } catch (err) {
    console.error("Exception saving site data to Supabase:", err);
    return { success: false, error: err };
  }
}

/**
 * Real-time listener for site data updates via Supabase Realtime
 */
export function subscribeSiteData(onUpdate) {
  if (!isConfigured || !supabase) {
    return () => {};
  }

  try {
    const channel = supabase
      .channel("site_settings_changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "site_settings",
          filter: `id=eq.${SETTINGS_ROW_ID}`,
        },
        (payload) => {
          if (payload.new && payload.new.content_json) {
            try {
              const parsed =
                typeof payload.new.content_json === "string"
                  ? JSON.parse(payload.new.content_json)
                  : payload.new.content_json;
              onUpdate(parsed);
            } catch (e) {
              console.error("Error parsing real-time Supabase update:", e);
            }
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  } catch (err) {
    console.warn("Could not attach Supabase realtime listener:", err);
    return () => {};
  }
}
