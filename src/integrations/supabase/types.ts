export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      attendance: {
        Row: {
          check_in: string | null
          check_out: string | null
          created_at: string | null
          date: string
          id: string
          notes: string | null
          overtime_hours: number | null
          profile_id: string
          status: string | null
          working_hours: number | null
        }
        Insert: {
          check_in?: string | null
          check_out?: string | null
          created_at?: string | null
          date: string
          id?: string
          notes?: string | null
          overtime_hours?: number | null
          profile_id: string
          status?: string | null
          working_hours?: number | null
        }
        Update: {
          check_in?: string | null
          check_out?: string | null
          created_at?: string | null
          date?: string
          id?: string
          notes?: string | null
          overtime_hours?: number | null
          profile_id?: string
          status?: string | null
          working_hours?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "attendance_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      bookings: {
        Row: {
          base_price: number | null
          booking_number: string
          contract_id: string | null
          created_at: string | null
          created_by: string | null
          customer_id: string
          distance_km: number | null
          dropoff_location: string
          estimated_duration: number | null
          id: string
          notes: string | null
          passenger_count: number | null
          pickup_datetime: string
          pickup_location: string
          route_id: string | null
          special_requests: string | null
          status: Database["public"]["Enums"]["booking_status"] | null
          total_price: number | null
          updated_at: string | null
        }
        Insert: {
          base_price?: number | null
          booking_number: string
          contract_id?: string | null
          created_at?: string | null
          created_by?: string | null
          customer_id: string
          distance_km?: number | null
          dropoff_location: string
          estimated_duration?: number | null
          id?: string
          notes?: string | null
          passenger_count?: number | null
          pickup_datetime: string
          pickup_location: string
          route_id?: string | null
          special_requests?: string | null
          status?: Database["public"]["Enums"]["booking_status"] | null
          total_price?: number | null
          updated_at?: string | null
        }
        Update: {
          base_price?: number | null
          booking_number?: string
          contract_id?: string | null
          created_at?: string | null
          created_by?: string | null
          customer_id?: string
          distance_km?: number | null
          dropoff_location?: string
          estimated_duration?: number | null
          id?: string
          notes?: string | null
          passenger_count?: number | null
          pickup_datetime?: string
          pickup_location?: string
          route_id?: string | null
          special_requests?: string | null
          status?: Database["public"]["Enums"]["booking_status"] | null
          total_price?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "bookings_contract_id_fkey"
            columns: ["contract_id"]
            isOneToOne: false
            referencedRelation: "contracts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_route_id_fkey"
            columns: ["route_id"]
            isOneToOne: false
            referencedRelation: "routes"
            referencedColumns: ["id"]
          },
        ]
      }
      contracts: {
        Row: {
          contract_number: string
          created_at: string | null
          created_by: string | null
          customer_id: string
          end_date: string
          id: string
          notes: string | null
          start_date: string
          status: Database["public"]["Enums"]["contract_status"] | null
          terms: string | null
          title: string
          total_amount: number | null
          updated_at: string | null
        }
        Insert: {
          contract_number: string
          created_at?: string | null
          created_by?: string | null
          customer_id: string
          end_date: string
          id?: string
          notes?: string | null
          start_date: string
          status?: Database["public"]["Enums"]["contract_status"] | null
          terms?: string | null
          title: string
          total_amount?: number | null
          updated_at?: string | null
        }
        Update: {
          contract_number?: string
          created_at?: string | null
          created_by?: string | null
          customer_id?: string
          end_date?: string
          id?: string
          notes?: string | null
          start_date?: string
          status?: Database["public"]["Enums"]["contract_status"] | null
          terms?: string | null
          title?: string
          total_amount?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "contracts_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contracts_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
        ]
      }
      customers: {
        Row: {
          address: string | null
          company_name: string | null
          contact_person: string | null
          created_at: string | null
          created_by: string | null
          customer_type: string | null
          email: string | null
          id: string
          name: string
          notes: string | null
          phone: string
          tax_code: string | null
          updated_at: string | null
        }
        Insert: {
          address?: string | null
          company_name?: string | null
          contact_person?: string | null
          created_at?: string | null
          created_by?: string | null
          customer_type?: string | null
          email?: string | null
          id?: string
          name: string
          notes?: string | null
          phone: string
          tax_code?: string | null
          updated_at?: string | null
        }
        Update: {
          address?: string | null
          company_name?: string | null
          contact_person?: string | null
          created_at?: string | null
          created_by?: string | null
          customer_type?: string | null
          email?: string | null
          id?: string
          name?: string
          notes?: string | null
          phone?: string
          tax_code?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "customers_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      departments: {
        Row: {
          code: string
          created_at: string | null
          description: string | null
          id: string
          manager_id: string | null
          name: string
          parent_id: string | null
          updated_at: string | null
        }
        Insert: {
          code: string
          created_at?: string | null
          description?: string | null
          id?: string
          manager_id?: string | null
          name: string
          parent_id?: string | null
          updated_at?: string | null
        }
        Update: {
          code?: string
          created_at?: string | null
          description?: string | null
          id?: string
          manager_id?: string | null
          name?: string
          parent_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "departments_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "departments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_manager"
            columns: ["manager_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      drivers: {
        Row: {
          created_at: string | null
          emergency_contact: string | null
          emergency_phone: string | null
          experience_years: number | null
          id: string
          license_expiry: string
          license_number: string
          license_type: string
          notes: string | null
          profile_id: string | null
          rating: number | null
          status: Database["public"]["Enums"]["driver_status"] | null
          total_trips: number | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          emergency_contact?: string | null
          emergency_phone?: string | null
          experience_years?: number | null
          id?: string
          license_expiry: string
          license_number: string
          license_type: string
          notes?: string | null
          profile_id?: string | null
          rating?: number | null
          status?: Database["public"]["Enums"]["driver_status"] | null
          total_trips?: number | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          emergency_contact?: string | null
          emergency_phone?: string | null
          experience_years?: number | null
          id?: string
          license_expiry?: string
          license_number?: string
          license_type?: string
          notes?: string | null
          profile_id?: string | null
          rating?: number | null
          status?: Database["public"]["Enums"]["driver_status"] | null
          total_trips?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "drivers_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      expenses: {
        Row: {
          amount: number
          approved_at: string | null
          approved_by: string | null
          booking_id: string | null
          category: string
          created_at: string | null
          created_by: string | null
          date: string
          description: string
          id: string
          notes: string | null
          payment_method: string | null
          receipt_number: string | null
          vehicle_id: string | null
          vendor: string | null
        }
        Insert: {
          amount: number
          approved_at?: string | null
          approved_by?: string | null
          booking_id?: string | null
          category: string
          created_at?: string | null
          created_by?: string | null
          date: string
          description: string
          id?: string
          notes?: string | null
          payment_method?: string | null
          receipt_number?: string | null
          vehicle_id?: string | null
          vendor?: string | null
        }
        Update: {
          amount?: number
          approved_at?: string | null
          approved_by?: string | null
          booking_id?: string | null
          category?: string
          created_at?: string | null
          created_by?: string | null
          date?: string
          description?: string
          id?: string
          notes?: string | null
          payment_method?: string | null
          receipt_number?: string | null
          vehicle_id?: string | null
          vendor?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "expenses_approved_by_fkey"
            columns: ["approved_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "expenses_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "expenses_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "expenses_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      fuel_records: {
        Row: {
          created_at: string | null
          created_by: string | null
          date: string | null
          driver_id: string | null
          id: string
          liters: number
          mileage: number | null
          notes: string | null
          price_per_liter: number
          receipt_number: string | null
          station_name: string | null
          total_cost: number
          vehicle_id: string
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          date?: string | null
          driver_id?: string | null
          id?: string
          liters: number
          mileage?: number | null
          notes?: string | null
          price_per_liter: number
          receipt_number?: string | null
          station_name?: string | null
          total_cost: number
          vehicle_id: string
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          date?: string | null
          driver_id?: string | null
          id?: string
          liters?: number
          mileage?: number | null
          notes?: string | null
          price_per_liter?: number
          receipt_number?: string | null
          station_name?: string | null
          total_cost?: number
          vehicle_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fuel_records_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fuel_records_driver_id_fkey"
            columns: ["driver_id"]
            isOneToOne: false
            referencedRelation: "drivers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fuel_records_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      incidents: {
        Row: {
          booking_id: string | null
          created_at: string | null
          damage_assessment: string | null
          description: string
          driver_id: string | null
          estimated_cost: number | null
          id: string
          incident_datetime: string
          insurance_claim_number: string | null
          location: string
          photos: string[] | null
          reported_by: string | null
          resolution: string | null
          severity: Database["public"]["Enums"]["incident_severity"]
          status: string | null
          updated_at: string | null
          vehicle_id: string | null
        }
        Insert: {
          booking_id?: string | null
          created_at?: string | null
          damage_assessment?: string | null
          description: string
          driver_id?: string | null
          estimated_cost?: number | null
          id?: string
          incident_datetime: string
          insurance_claim_number?: string | null
          location: string
          photos?: string[] | null
          reported_by?: string | null
          resolution?: string | null
          severity: Database["public"]["Enums"]["incident_severity"]
          status?: string | null
          updated_at?: string | null
          vehicle_id?: string | null
        }
        Update: {
          booking_id?: string | null
          created_at?: string | null
          damage_assessment?: string | null
          description?: string
          driver_id?: string | null
          estimated_cost?: number | null
          id?: string
          incident_datetime?: string
          insurance_claim_number?: string | null
          location?: string
          photos?: string[] | null
          reported_by?: string | null
          resolution?: string | null
          severity?: Database["public"]["Enums"]["incident_severity"]
          status?: string | null
          updated_at?: string | null
          vehicle_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "incidents_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "incidents_driver_id_fkey"
            columns: ["driver_id"]
            isOneToOne: false
            referencedRelation: "drivers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "incidents_reported_by_fkey"
            columns: ["reported_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "incidents_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      insurance_records: {
        Row: {
          coverage_details: string | null
          created_at: string | null
          created_by: string | null
          expiry_date: string
          id: string
          notes: string | null
          policy_number: string
          premium: number | null
          provider: string
          start_date: string
          updated_at: string | null
          vehicle_id: string
        }
        Insert: {
          coverage_details?: string | null
          created_at?: string | null
          created_by?: string | null
          expiry_date: string
          id?: string
          notes?: string | null
          policy_number: string
          premium?: number | null
          provider: string
          start_date: string
          updated_at?: string | null
          vehicle_id: string
        }
        Update: {
          coverage_details?: string | null
          created_at?: string | null
          created_by?: string | null
          expiry_date?: string
          id?: string
          notes?: string | null
          policy_number?: string
          premium?: number | null
          provider?: string
          start_date?: string
          updated_at?: string | null
          vehicle_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "insurance_records_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "insurance_records_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      invoices: {
        Row: {
          booking_id: string | null
          contract_id: string | null
          created_at: string | null
          created_by: string | null
          customer_id: string
          due_date: string
          id: string
          invoice_number: string
          issue_date: string
          notes: string | null
          paid_amount: number | null
          payment_status: Database["public"]["Enums"]["payment_status"] | null
          subtotal: number
          tax_amount: number | null
          total_amount: number
          updated_at: string | null
        }
        Insert: {
          booking_id?: string | null
          contract_id?: string | null
          created_at?: string | null
          created_by?: string | null
          customer_id: string
          due_date: string
          id?: string
          invoice_number: string
          issue_date: string
          notes?: string | null
          paid_amount?: number | null
          payment_status?: Database["public"]["Enums"]["payment_status"] | null
          subtotal: number
          tax_amount?: number | null
          total_amount: number
          updated_at?: string | null
        }
        Update: {
          booking_id?: string | null
          contract_id?: string | null
          created_at?: string | null
          created_by?: string | null
          customer_id?: string
          due_date?: string
          id?: string
          invoice_number?: string
          issue_date?: string
          notes?: string | null
          paid_amount?: number | null
          payment_status?: Database["public"]["Enums"]["payment_status"] | null
          subtotal?: number
          tax_amount?: number | null
          total_amount?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "invoices_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoices_contract_id_fkey"
            columns: ["contract_id"]
            isOneToOne: false
            referencedRelation: "contracts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoices_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoices_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
        ]
      }
      kpi_metrics: {
        Row: {
          calculation_formula: string | null
          category: string
          created_at: string | null
          department_id: string | null
          description: string | null
          id: string
          is_active: boolean | null
          name: string
          target_value: number | null
          unit: string | null
          updated_at: string | null
          weight: number | null
        }
        Insert: {
          calculation_formula?: string | null
          category: string
          created_at?: string | null
          department_id?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          target_value?: number | null
          unit?: string | null
          updated_at?: string | null
          weight?: number | null
        }
        Update: {
          calculation_formula?: string | null
          category?: string
          created_at?: string | null
          department_id?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          target_value?: number | null
          unit?: string | null
          updated_at?: string | null
          weight?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "kpi_metrics_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "departments"
            referencedColumns: ["id"]
          },
        ]
      }
      kpi_records: {
        Row: {
          achievement_rate: number | null
          actual_value: number
          created_at: string | null
          department_id: string | null
          id: string
          metric_id: string
          notes: string | null
          period_end: string
          period_start: string
          profile_id: string | null
          target_value: number | null
        }
        Insert: {
          achievement_rate?: number | null
          actual_value: number
          created_at?: string | null
          department_id?: string | null
          id?: string
          metric_id: string
          notes?: string | null
          period_end: string
          period_start: string
          profile_id?: string | null
          target_value?: number | null
        }
        Update: {
          achievement_rate?: number | null
          actual_value?: number
          created_at?: string | null
          department_id?: string | null
          id?: string
          metric_id?: string
          notes?: string | null
          period_end?: string
          period_start?: string
          profile_id?: string | null
          target_value?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "kpi_records_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "departments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "kpi_records_metric_id_fkey"
            columns: ["metric_id"]
            isOneToOne: false
            referencedRelation: "kpi_metrics"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "kpi_records_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      leave_requests: {
        Row: {
          approved_at: string | null
          approved_by: string | null
          created_at: string | null
          end_date: string
          id: string
          leave_type: string
          notes: string | null
          profile_id: string
          reason: string | null
          start_date: string
          status: Database["public"]["Enums"]["leave_status"] | null
          total_days: number
          updated_at: string | null
        }
        Insert: {
          approved_at?: string | null
          approved_by?: string | null
          created_at?: string | null
          end_date: string
          id?: string
          leave_type: string
          notes?: string | null
          profile_id: string
          reason?: string | null
          start_date: string
          status?: Database["public"]["Enums"]["leave_status"] | null
          total_days: number
          updated_at?: string | null
        }
        Update: {
          approved_at?: string | null
          approved_by?: string | null
          created_at?: string | null
          end_date?: string
          id?: string
          leave_type?: string
          notes?: string | null
          profile_id?: string
          reason?: string | null
          start_date?: string
          status?: Database["public"]["Enums"]["leave_status"] | null
          total_days?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "leave_requests_approved_by_fkey"
            columns: ["approved_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "leave_requests_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      maintenance_records: {
        Row: {
          cost: number | null
          created_at: string | null
          created_by: string | null
          date: string
          description: string
          id: string
          invoice_number: string | null
          mileage: number | null
          next_maintenance_date: string | null
          notes: string | null
          service_provider: string | null
          type: Database["public"]["Enums"]["maintenance_type"]
          updated_at: string | null
          vehicle_id: string
        }
        Insert: {
          cost?: number | null
          created_at?: string | null
          created_by?: string | null
          date: string
          description: string
          id?: string
          invoice_number?: string | null
          mileage?: number | null
          next_maintenance_date?: string | null
          notes?: string | null
          service_provider?: string | null
          type: Database["public"]["Enums"]["maintenance_type"]
          updated_at?: string | null
          vehicle_id: string
        }
        Update: {
          cost?: number | null
          created_at?: string | null
          created_by?: string | null
          date?: string
          description?: string
          id?: string
          invoice_number?: string | null
          mileage?: number | null
          next_maintenance_date?: string | null
          notes?: string | null
          service_provider?: string | null
          type?: Database["public"]["Enums"]["maintenance_type"]
          updated_at?: string | null
          vehicle_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "maintenance_records_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "maintenance_records_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          address: string | null
          avatar_url: string | null
          created_at: string | null
          date_of_birth: string | null
          department_id: string | null
          email: string | null
          employee_code: string | null
          full_name: string
          hire_date: string | null
          id: string
          phone: string | null
          updated_at: string | null
        }
        Insert: {
          address?: string | null
          avatar_url?: string | null
          created_at?: string | null
          date_of_birth?: string | null
          department_id?: string | null
          email?: string | null
          employee_code?: string | null
          full_name: string
          hire_date?: string | null
          id: string
          phone?: string | null
          updated_at?: string | null
        }
        Update: {
          address?: string | null
          avatar_url?: string | null
          created_at?: string | null
          date_of_birth?: string | null
          department_id?: string | null
          email?: string | null
          employee_code?: string | null
          full_name?: string
          hire_date?: string | null
          id?: string
          phone?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "departments"
            referencedColumns: ["id"]
          },
        ]
      }
      routes: {
        Row: {
          base_price: number | null
          created_at: string | null
          description: string | null
          distance_km: number | null
          estimated_duration: number | null
          from_location: string
          id: string
          is_active: boolean | null
          name: string
          to_location: string
          updated_at: string | null
        }
        Insert: {
          base_price?: number | null
          created_at?: string | null
          description?: string | null
          distance_km?: number | null
          estimated_duration?: number | null
          from_location: string
          id?: string
          is_active?: boolean | null
          name: string
          to_location: string
          updated_at?: string | null
        }
        Update: {
          base_price?: number | null
          created_at?: string | null
          description?: string | null
          distance_km?: number | null
          estimated_duration?: number | null
          from_location?: string
          id?: string
          is_active?: boolean | null
          name?: string
          to_location?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      services: {
        Row: {
          category: string | null
          code: string
          created_at: string | null
          description: string | null
          id: string
          is_active: boolean | null
          name: string
          price: number | null
          unit: string | null
          updated_at: string | null
        }
        Insert: {
          category?: string | null
          code: string
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          price?: number | null
          unit?: string | null
          updated_at?: string | null
        }
        Update: {
          category?: string | null
          code?: string
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          price?: number | null
          unit?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      vehicle_assignments: {
        Row: {
          assigned_at: string | null
          assigned_by: string | null
          booking_id: string
          created_at: string | null
          driver_id: string
          end_mileage: number | null
          end_time: string | null
          id: string
          notes: string | null
          start_mileage: number | null
          start_time: string | null
          updated_at: string | null
          vehicle_id: string
        }
        Insert: {
          assigned_at?: string | null
          assigned_by?: string | null
          booking_id: string
          created_at?: string | null
          driver_id: string
          end_mileage?: number | null
          end_time?: string | null
          id?: string
          notes?: string | null
          start_mileage?: number | null
          start_time?: string | null
          updated_at?: string | null
          vehicle_id: string
        }
        Update: {
          assigned_at?: string | null
          assigned_by?: string | null
          booking_id?: string
          created_at?: string | null
          driver_id?: string
          end_mileage?: number | null
          end_time?: string | null
          id?: string
          notes?: string | null
          start_mileage?: number | null
          start_time?: string | null
          updated_at?: string | null
          vehicle_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "vehicle_assignments_assigned_by_fkey"
            columns: ["assigned_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vehicle_assignments_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vehicle_assignments_driver_id_fkey"
            columns: ["driver_id"]
            isOneToOne: false
            referencedRelation: "drivers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vehicle_assignments_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      vehicles: {
        Row: {
          brand: string
          color: string | null
          created_at: string | null
          current_mileage: number | null
          fuel_type: string | null
          id: string
          insurance_expiry: string | null
          last_maintenance_date: string | null
          license_plate: string
          model: string
          next_maintenance_date: string | null
          notes: string | null
          registration_expiry: string | null
          seats: number
          status: Database["public"]["Enums"]["vehicle_status"] | null
          updated_at: string | null
          vin: string | null
          year: number | null
        }
        Insert: {
          brand: string
          color?: string | null
          created_at?: string | null
          current_mileage?: number | null
          fuel_type?: string | null
          id?: string
          insurance_expiry?: string | null
          last_maintenance_date?: string | null
          license_plate: string
          model: string
          next_maintenance_date?: string | null
          notes?: string | null
          registration_expiry?: string | null
          seats: number
          status?: Database["public"]["Enums"]["vehicle_status"] | null
          updated_at?: string | null
          vin?: string | null
          year?: number | null
        }
        Update: {
          brand?: string
          color?: string | null
          created_at?: string | null
          current_mileage?: number | null
          fuel_type?: string | null
          id?: string
          insurance_expiry?: string | null
          last_maintenance_date?: string | null
          license_plate?: string
          model?: string
          next_maintenance_date?: string | null
          notes?: string | null
          registration_expiry?: string | null
          seats?: number
          status?: Database["public"]["Enums"]["vehicle_status"] | null
          updated_at?: string | null
          vin?: string | null
          year?: number | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "manager" | "staff" | "driver" | "accountant" | "hr"
      booking_status:
        | "pending"
        | "confirmed"
        | "assigned"
        | "in_progress"
        | "completed"
        | "cancelled"
      contract_status: "draft" | "active" | "expired" | "terminated"
      driver_status: "available" | "on_trip" | "off_duty" | "leave"
      incident_severity: "low" | "medium" | "high" | "critical"
      leave_status: "pending" | "approved" | "rejected"
      maintenance_type: "regular" | "repair" | "inspection" | "emergency"
      payment_status: "pending" | "partial" | "paid" | "overdue"
      vehicle_status: "available" | "in_use" | "maintenance" | "inactive"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "manager", "staff", "driver", "accountant", "hr"],
      booking_status: [
        "pending",
        "confirmed",
        "assigned",
        "in_progress",
        "completed",
        "cancelled",
      ],
      contract_status: ["draft", "active", "expired", "terminated"],
      driver_status: ["available", "on_trip", "off_duty", "leave"],
      incident_severity: ["low", "medium", "high", "critical"],
      leave_status: ["pending", "approved", "rejected"],
      maintenance_type: ["regular", "repair", "inspection", "emergency"],
      payment_status: ["pending", "partial", "paid", "overdue"],
      vehicle_status: ["available", "in_use", "maintenance", "inactive"],
    },
  },
} as const
