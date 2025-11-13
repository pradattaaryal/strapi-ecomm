    export const toStringSafe = (v: unknown): string | undefined =>
      typeof v === 'string' && v.trim() !== '' ? v : undefined;
    
    export const toBoolSafe = (v: unknown): boolean | undefined =>
      typeof v === 'string'
        ? v.toLowerCase() === 'true'
          ? true
          : v.toLowerCase() === 'false'
          ? false
          : undefined
        : typeof v === 'boolean'
        ? v
        : undefined;
    
    export const toNumSafe = (v: unknown): number | undefined => {
      if (typeof v === 'number') return Number.isFinite(v) ? v : undefined;
      if (typeof v === 'string' && v.trim() !== '') {
        const n = Number(v);
        return Number.isFinite(n) ? n : undefined;
      }
      return undefined;
    };
    
    export const toStringArray = (v: unknown): string[] | undefined => {
      if (Array.isArray(v)) return v.map((x) => String(x)).filter(Boolean);
      const s = toStringSafe(v);
      return s ? s.split(',').map((x) => x.trim()).filter(Boolean) : undefined;
    };