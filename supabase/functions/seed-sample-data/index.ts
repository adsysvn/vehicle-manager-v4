import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.77.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    );

    console.log('Starting sample data seeding...');

    // Get department IDs
    const { data: departments } = await supabaseAdmin.from('departments').select('id, code');
    const deptMap = departments?.reduce((acc: any, dept: any) => {
      acc[dept.code] = dept.id;
      return acc;
    }, {}) || {};

    // Create admin user
    console.log('Creating admin user...');
    const { data: adminData, error: adminError } = await supabaseAdmin.auth.admin.createUser({
      email: 'admin@company.vn',
      password: 'Admin@123',
      email_confirm: true,
      user_metadata: { full_name: 'Nguyễn Văn Admin' }
    });

    if (adminError) throw adminError;

    await supabaseAdmin.from('profiles').insert({
      id: adminData.user.id,
      full_name: 'Nguyễn Văn Admin',
      email: 'admin@company.vn',
      phone: '0901234567',
      department_id: deptMap['BGD'],
      employee_code: 'ADMIN001',
      hire_date: new Date().toISOString().split('T')[0]
    });

    await supabaseAdmin.from('user_roles').insert({
      user_id: adminData.user.id,
      role: 'admin'
    });

    // Create Kinh Doanh staff (1-15)
    console.log('Creating Kinh Doanh staff...');
    for (let i = 1; i <= 15; i++) {
      const { data: userData } = await supabaseAdmin.auth.admin.createUser({
        email: `kinhdoanh${i}@company.vn`,
        password: `KD${i}@123`,
        email_confirm: true,
        user_metadata: { full_name: `Nhân viên Kinh Doanh ${i}` }
      });

      if (userData?.user) {
        await supabaseAdmin.from('profiles').insert({
          id: userData.user.id,
          full_name: `Nhân viên Kinh Doanh ${i}`,
          email: `kinhdoanh${i}@company.vn`,
          phone: `090${String(i).padStart(7, '0')}`,
          department_id: deptMap['KD'],
          employee_code: `KD${String(i).padStart(3, '0')}`,
          hire_date: new Date().toISOString().split('T')[0]
        });

        await supabaseAdmin.from('user_roles').insert({
          user_id: userData.user.id,
          role: 'staff'
        });
      }
    }

    // Create Điều Hành staff (1-7)
    console.log('Creating Điều Hành staff...');
    for (let i = 1; i <= 7; i++) {
      const { data: userData } = await supabaseAdmin.auth.admin.createUser({
        email: `dieuhanh${i}@company.vn`,
        password: `DH${i}@123`,
        email_confirm: true,
        user_metadata: { full_name: `Nhân viên Điều Hành ${i}` }
      });

      if (userData?.user) {
        await supabaseAdmin.from('profiles').insert({
          id: userData.user.id,
          full_name: `Nhân viên Điều Hành ${i}`,
          email: `dieuhanh${i}@company.vn`,
          phone: `091${String(i).padStart(7, '0')}`,
          department_id: deptMap['VH'],
          employee_code: `DH${String(i).padStart(3, '0')}`,
          hire_date: new Date().toISOString().split('T')[0]
        });

        await supabaseAdmin.from('user_roles').insert({
          user_id: userData.user.id,
          role: 'manager'
        });
      }
    }

    // Create Kỹ Thuật staff (1-5)
    console.log('Creating Kỹ Thuật staff...');
    for (let i = 1; i <= 5; i++) {
      const { data: userData } = await supabaseAdmin.auth.admin.createUser({
        email: `kythuat${i}@company.vn`,
        password: `KT${i}@123`,
        email_confirm: true,
        user_metadata: { full_name: `Nhân viên Kỹ Thuật ${i}` }
      });

      if (userData?.user) {
        await supabaseAdmin.from('profiles').insert({
          id: userData.user.id,
          full_name: `Nhân viên Kỹ Thuật ${i}`,
          email: `kythuat${i}@company.vn`,
          phone: `092${String(i).padStart(7, '0')}`,
          department_id: deptMap['KYTHUAT'],
          employee_code: `KT${String(i).padStart(3, '0')}`,
          hire_date: new Date().toISOString().split('T')[0]
        });

        await supabaseAdmin.from('user_roles').insert({
          user_id: userData.user.id,
          role: 'staff'
        });
      }
    }

    // Create Nhân Sự staff (1-3)
    console.log('Creating Nhân Sự staff...');
    for (let i = 1; i <= 3; i++) {
      const { data: userData } = await supabaseAdmin.auth.admin.createUser({
        email: `nhansu${i}@company.vn`,
        password: `NS${i}@123`,
        email_confirm: true,
        user_metadata: { full_name: `Nhân viên Nhân Sự ${i}` }
      });

      if (userData?.user) {
        await supabaseAdmin.from('profiles').insert({
          id: userData.user.id,
          full_name: `Nhân viên Nhân Sự ${i}`,
          email: `nhansu${i}@company.vn`,
          phone: `093${String(i).padStart(7, '0')}`,
          department_id: deptMap['NS'],
          employee_code: `NS${String(i).padStart(3, '0')}`,
          hire_date: new Date().toISOString().split('T')[0]
        });

        await supabaseAdmin.from('user_roles').insert({
          user_id: userData.user.id,
          role: 'hr'
        });
      }
    }

    // Create Kế Toán staff (1-4)
    console.log('Creating Kế Toán staff...');
    for (let i = 1; i <= 4; i++) {
      const { data: userData } = await supabaseAdmin.auth.admin.createUser({
        email: `ketoan${i}@company.vn`,
        password: `KTC${i}@123`,
        email_confirm: true,
        user_metadata: { full_name: `Nhân viên Kế Toán ${i}` }
      });

      if (userData?.user) {
        await supabaseAdmin.from('profiles').insert({
          id: userData.user.id,
          full_name: `Nhân viên Kế Toán ${i}`,
          email: `ketoan${i}@company.vn`,
          phone: `094${String(i).padStart(7, '0')}`,
          department_id: deptMap['KETOAN'],
          employee_code: `KTC${String(i).padStart(3, '0')}`,
          hire_date: new Date().toISOString().split('T')[0]
        });

        await supabaseAdmin.from('user_roles').insert({
          user_id: userData.user.id,
          role: 'accountant'
        });
      }
    }

    // Create Drivers (1-12)
    console.log('Creating drivers...');
    for (let i = 1; i <= 12; i++) {
      const { data: userData } = await supabaseAdmin.auth.admin.createUser({
        email: `laixe${i}@company.vn`,
        password: `LX${i}@123`,
        email_confirm: true,
        user_metadata: { full_name: `Lái xe ${i}` }
      });

      if (userData?.user) {
        await supabaseAdmin.from('profiles').insert({
          id: userData.user.id,
          full_name: `Lái xe ${i}`,
          email: `laixe${i}@company.vn`,
          phone: `095${String(i).padStart(7, '0')}`,
          department_id: deptMap['LX'],
          employee_code: `LX${String(i).padStart(3, '0')}`,
          hire_date: new Date().toISOString().split('T')[0]
        });

        await supabaseAdmin.from('user_roles').insert({
          user_id: userData.user.id,
          role: 'driver'
        });

        await supabaseAdmin.from('drivers').insert({
          profile_id: userData.user.id,
          license_number: `B2-${String(i).padStart(6, '0')}`,
          license_type: 'B2',
          license_expiry: new Date(Date.now() + 2 * 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          status: 'available',
          rating: 4.5 + Math.random() * 0.5,
          experience_years: 3 + i
        });
      }
    }

    // Get first KD user for sample data creation
    const { data: kdUser } = await supabaseAdmin.from('profiles')
      .select('id')
      .eq('employee_code', 'KD001')
      .single();

    const { data: customer } = await supabaseAdmin.from('customers')
      .select('id')
      .eq('name', 'Công ty TNHH Du Lịch Việt')
      .single();

    // Create sample contracts
    console.log('Creating sample contracts...');
    const { data: contract } = await supabaseAdmin.from('contracts')
      .insert({
        contract_number: 'HD-2024-001',
        customer_id: customer?.id,
        title: 'Hợp đồng thuê xe du lịch năm 2024',
        start_date: '2024-01-01',
        end_date: '2024-12-31',
        status: 'active',
        total_amount: 50000000,
        created_by: kdUser?.id
      })
      .select()
      .single();

    // Create sample bookings
    console.log('Creating sample bookings...');
    const { data: route } = await supabaseAdmin.from('routes')
      .select('id')
      .eq('name', 'HN - HP')
      .single();

    const bookings = [];
    for (let i = 1; i <= 20; i++) {
      const status = i <= 5 ? 'completed' : i <= 10 ? 'assigned' : i <= 15 ? 'confirmed' : 'pending';
      const pickupDate = new Date();
      pickupDate.setDate(pickupDate.getDate() + i);

      const { data: booking } = await supabaseAdmin.from('bookings')
        .insert({
          booking_number: `BK-2024-${String(i).padStart(4, '0')}`,
          customer_id: customer?.id,
          route_id: route?.id,
          contract_id: i <= 10 ? contract?.id : null,
          pickup_location: 'Hà Nội',
          dropoff_location: 'Hải Phòng',
          pickup_datetime: pickupDate.toISOString(),
          estimated_duration: 120,
          passenger_count: 10 + (i % 15),
          status,
          distance_km: 120,
          base_price: 1500000,
          total_price: 1500000 + (i * 50000),
          created_by: kdUser?.id
        })
        .select()
        .single();

      if (booking && i <= 10) {
        bookings.push(booking);
      }
    }

    // Assign vehicles and drivers to first 10 bookings
    console.log('Assigning vehicles and drivers...');
    const { data: vehicles } = await supabaseAdmin.from('vehicles').select('id');
    const { data: drivers } = await supabaseAdmin.from('drivers').select('id');

    for (let i = 0; i < Math.min(bookings.length, 10); i++) {
      const vehicle = vehicles?.[i % vehicles.length];
      const driver = drivers?.[i % drivers.length];

      if (vehicle && driver) {
        await supabaseAdmin.from('vehicle_assignments').insert({
          booking_id: bookings[i].id,
          vehicle_id: vehicle.id,
          driver_id: driver.id,
          assigned_by: kdUser?.id,
          start_mileage: 25000 + (i * 100),
          start_time: bookings[i].pickup_datetime
        });
      }
    }

    console.log('Sample data seeding completed successfully!');

    return new Response(
      JSON.stringify({ success: true, message: 'Sample data created successfully' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error seeding sample data:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error occurred' }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});