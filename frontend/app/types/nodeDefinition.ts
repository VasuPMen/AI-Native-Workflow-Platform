export interface NodeFieldDefinition {
  key: string;
  label: string;
  field_type: string;
  required: boolean;
  default: any;
  placeholder?: string | null;
  options?: string[] | null;
  description?: string | null;
}

export interface NodeDefinition {
  type: string;
  label: string;
  category: string;
  description: string;
  icon?: string | null;
  config_fields: NodeFieldDefinition[];
  input_schema: Record<string, any>;
  output_schema: Record<string, any>;
}