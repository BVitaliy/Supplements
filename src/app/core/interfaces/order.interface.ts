// export interface Order {
//   id: number;
//   total_price?: number;
//   status?: number;
//   client?: {
//      id: number;
//      name: string;
//      phone: string;
//      address: string
//   };
//   pickup_info?: {
//      name: string;
//      phone: string;
//      address: string
//   };
//   delivery_info?: {
//      name: string;
//      phone: string;
//      address: string
//   };
//   created_date: string;
//   picked_date: string;
//   delivery_date: string;
//   cars?: Array<{
//     id: number;
//     title: string;
//     type: string;
//     color: string;
//     vehicle_number: string;
//     VIN: string;
//     lot_id: number;
//     info: string
//   }>;
//   bol?: Array<{
//     id: string;
//     vehicle_conditions: Array<{
//       view_type: string; // (front; left; right; back; top);
//       image: {
//         id: number;
//         file_type: string;
//         filename: string;
//         width: number;
//         height: number;
//         type: string
//       };
//       marks: Array<{
//         name: string;
//         short_name: string;
//         x: string;
//         y: string;
//       }>;
//     }>;
//     inspection_condition: number;
//     driver_comment: string;
//     sender_signature: boolean;
//     driver_signature: boolean;
//     recipient_signature: boolean;
//     uploaded_files: Array<{ // або vehicle_photos
//       id: number;
//       file_type: string;
//       filename: string;
//       width: number;
//       height: number;
//       type: string;
//     }>;
//   }>;
// }

export interface Order {
  id?: number;
  external_id?: string | number;
  created_at?: string;
  pickup_estimated?: string;
  delivery_estimated?: string;
  dispatch_date?: string;
  status?: any;
  total_price?: number;
  payment_images?: Array<any>;
  payment_status?: number;
  payment_type?: number;
  pickup_info?: {
    name: string;
    email?: string;
    phones: string;
    phone?: Array<string>;
    address: {
      address: string;
      lat: number;
      lng: number;
    };
  };
  delivery_info?: {
    name: string;
    email?: string;
    phones: string;
    phone?: Array<string>;
    address: {
      address: string;
      lat: number;
      lng: number;
    };
  };
  order_cars?: Array<{
    id?: number;
    title?: string;
    type?: string;
    color?: string;
    vehicle_number?: string;
    VIN?: string;
    lot_id?: string;
    info?: string;
    bol_html?: string;
    token?: string;
    // pickup_info?: {
    //   name: string;
    //   email?: string;
    //   phones: string;
    //   phone?: Array<string>;
    //   address: {
    //     address: string;
    //     lat: number;
    //     lng: number;
    //   };
    // };
    // delivery_info?: {
    //   name: string;
    //   email?: string;
    //   phones: string;
    //   phone?: Array<string>;
    //   address: {
    //     address: string;
    //     lat: number;
    //     lng: number;
    //   };
    // };

    // vehicle_conditions?: Array<{
    //   delivery_type?: {
    //     title?: string;
    //     color?: string;
    //   };
    //   type?: {
    //     damage_name?: string;
    //     damage_description?: string;
    //   };
    //   location?: {
    //     x?: number;
    //     y?: number;
    //   };
    // }>;

    inspection_condition?: Array<string>;
    driver_comments?: string;

    // consignor_signature_status?: any;
    // consignee_delivery_signature?: any;
    // consignee_signature_status?: any;

    // vehicle_photos?: Array<{
    //   id: number;
    //   file_type: string;
    //   filename: string;
    //   width: number;
    //   height: number;
    //   type: string;
    // }>;
  }>;
}
