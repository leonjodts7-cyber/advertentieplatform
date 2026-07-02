export type AdvertentieStatus = "concept" | "in_review" | "actief" | "gearchiveerd";

export interface Profiel {
  id: string;
  email: string;
  aangemaakt_op: string;
  bijgewerkt_op: string;
}

export interface Advertentie {
  id: string;
  aanbieder_id: string;
  titel: string;
  beschrijving: string;
  stad: string;
  leeftijd: number;
  prijs_vanaf: number;
  telefoon: string | null;
  beschikbaar: boolean;
  geverifieerd: boolean;
  status: AdvertentieStatus;
  premium?: boolean;
  premium_tot?: string | null;
  plaatsing_type?: string | null;
  plaatsing_eindigt_op?: string | null;
  aangemaakt_op: string;
  bijgewerkt_op: string;
}

export interface AdvertentieFoto {
  id: string;
  advertentie_id: string;
  url: string;
  volgorde: number;
  aangemaakt_op: string;
}

export interface Favoriet {
  id: string;
  user_id: string;
  advertentie_id: string;
  created_at: string;
}

export interface Database {
  public: {
    Tables: {
      profielen: {
        Row: Profiel;
        Insert: {
          id: string;
          email: string;
          aangemaakt_op?: string;
          bijgewerkt_op?: string;
        };
        Update: {
          id?: string;
          email?: string;
          aangemaakt_op?: string;
          bijgewerkt_op?: string;
        };
        Relationships: [];
      };
      advertenties: {
        Row: Advertentie;
        Insert: {
          id?: string;
          aanbieder_id: string;
          titel: string;
          beschrijving: string;
          stad: string;
          leeftijd: number;
          prijs_vanaf: number;
          telefoon?: string | null;
          beschikbaar?: boolean;
          geverifieerd?: boolean;
          status?: AdvertentieStatus;
          aangemaakt_op?: string;
          bijgewerkt_op?: string;
        };
        Update: {
          id?: string;
          aanbieder_id?: string;
          titel?: string;
          beschrijving?: string;
          stad?: string;
          leeftijd?: number;
          prijs_vanaf?: number;
          telefoon?: string | null;
          beschikbaar?: boolean;
          geverifieerd?: boolean;
          status?: AdvertentieStatus;
          aangemaakt_op?: string;
          bijgewerkt_op?: string;
        };
        Relationships: [];
      };
      advertentie_fotos: {
        Row: AdvertentieFoto;
        Insert: {
          id?: string;
          advertentie_id: string;
          url: string;
          volgorde?: number;
          aangemaakt_op?: string;
        };
        Update: {
          id?: string;
          advertentie_id?: string;
          url?: string;
          volgorde?: number;
          aangemaakt_op?: string;
        };
        Relationships: [];
      };
      favorieten: {
        Row: Favoriet;
        Insert: {
          id?: string;
          user_id: string;
          advertentie_id: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          advertentie_id?: string;
          created_at?: string;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}
