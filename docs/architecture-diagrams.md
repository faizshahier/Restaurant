# Architecture Diagrams

These diagrams reflect the **implemented** system (`supabase/schema.sql` + the
React app), not a planned design. They can be pasted into
[Eraser](https://www.eraser.io/) via its "Diagram as code" panel, or any Mermaid
renderer, and restyled.

Scope notes (important for consistency):

- There is **no online payment** in the system — orders are placed and fulfilled
  without a charge, so there is no `payments` table, no Payment Gateway, and no
  payment process.
- **Reservations do not exist** — they were replaced by the ordering flow. There
  is no `reservations` table or process.
- The **cart is client-side React state**, not a database table, so it is not a
  data store in the DFD.
- The only outbound email is the **Supabase Auth OTP** sent during sign-up.

---

## Entity-Relationship Diagram (ERD)

```mermaid
erDiagram
    users ||--o{ orders : "places (nullable: guest checkout)"
    orders ||--o{ order_items : "contains"
    foods ||--o{ order_items : "referenced by (nullable: SET NULL on delete)"
    categories ||--o{ foods : "groups"

    users {
        uuid id PK "FK to auth.users(id)"
        text name
        text email UK
        text phone_number
        text role "Admin | Customer | restaurant_manager"
        timestamptz created_at
        timestamptz updated_at
    }

    categories {
        uuid id PK
        text name
        timestamptz created_at
        timestamptz updated_at
    }

    foods {
        uuid id PK
        text name
        text description
        numeric price
        numeric discount_percentage
        text image
        uuid category_id FK
        boolean available
        timestamptz created_at
        timestamptz updated_at
    }

    orders {
        uuid id PK
        uuid user_id FK "nullable"
        text customer_name
        text phone
        text location
        numeric total
        text notes
        text status "Pending | Preparing | Shipped | Cancelled"
        timestamptz created_at
        timestamptz updated_at
    }

    order_items {
        uuid id PK
        uuid order_id FK
        uuid food_id FK "nullable"
        text food_name "snapshot at order time"
        integer quantity
        numeric price "snapshot at order time"
        timestamptz created_at
    }

    gallery {
        uuid id PK
        text image_url
        text title
        timestamptz created_at
        timestamptz updated_at
    }

    settings {
        uuid id PK
        text restaurant_name
        text logo
        text phone
        text email
        text address
        text delivery_zone
        jsonb opening_hours
        jsonb social_links
        boolean is_singleton UK "always true, forces single row"
        timestamptz created_at
        timestamptz updated_at
    }
```

`gallery` and `settings` are standalone (no foreign keys). `settings` is a
single-row table enforced by the unique `is_singleton` constraint.

---

## DFD Level 0 — Context Diagram

```mermaid
flowchart LR
    Customer[Customer]
    Admin[Admin / Restaurant Manager]
    Email[Email Service - Supabase Auth]
    System((Restaurant Website<br/>Supabase Backend))

    Customer -->|browse menu / gallery, place order, sign up| System
    System -->|menu, order confirmation, order history| Customer
    Admin -->|manage foods, categories, gallery, settings, orders, users| System
    System -->|order lists, analytics and reports| Admin
    System -->|send OTP verification code| Email
    Email -->|verification email| Customer
```

---

## DFD Level 1 — Major Processes

```mermaid
flowchart LR
    Customer[Customer]
    Admin[Admin / Manager]
    Email[Email Service]

    P1(1.0 User Auth)
    P2(2.0 Browse Menu & Gallery)
    P3(3.0 Place Order)
    P4(4.0 View My Orders)
    P5(5.0 Manage Orders)
    P6(6.0 Admin Content Mgmt)
    P7(7.0 Analytics)

    D1[(D1: users)]
    D2[(D2: foods)]
    D3[(D3: orders)]
    D4[(D4: order_items)]
    D5[(D5: categories)]
    D6[(D6: gallery)]
    D7[(D7: settings)]

    Customer -->|sign up / sign in / OTP code| P1
    P1 <--> D1
    P1 -->|OTP request| Email
    Email -->|6-digit code| Customer

    Customer -->|view| P2
    P2 --- D2
    P2 --- D5
    P2 --- D6
    P2 --- D7

    Customer -->|order details + delivery location| P3
    P3 -->|read prices/availability| D2
    P3 -->|atomic write| D3
    P3 -->|atomic write| D4
    P3 -->|confirmation| Customer

    Customer --> P4
    P4 -->|RLS: own orders only| D3
    P4 --- D4

    Admin -->|update status| P5
    P5 <--> D3

    Admin -->|CRUD| P6
    P6 <--> D2
    P6 <--> D5
    P6 <--> D6
    P6 <--> D7
    P6 -->|role changes - Admin only| D1

    Admin --> P7
    P7 -->|read| D3
    P7 -->|read| D4
```

---

## DFD Level 2 — Place Order (Process 3.0)

```mermaid
flowchart TD
    Customer[Customer]
    D2[(D2: foods)]
    D3[(D3: orders)]
    D4[(D4: order_items)]

    P31(3.1 Select Items<br/>client-side cart state)
    P32(3.2 Validate Input<br/>name, phone, location, items)
    P33(3.3 Calculate Total<br/>server-trusted, discount-aware)
    P34(3.4 Create Order<br/>create_order_with_items - atomic)

    Customer -->|select dishes + quantities| P31
    D2 -->|available foods, prices, discounts| P31
    P31 --> P32
    P32 -->|validation errors| Customer
    P32 --> P33
    P33 --> P34
    P34 -->|insert order| D3
    P34 -->|insert line items| D4
    P34 -->|confirmation: total, location, status| Customer
```

The total is computed server-side (`OrderService.createOrder`) and never trusted
from the client form. The order and its line items are written in a single atomic
transaction via the `create_order_with_items` Postgres function, not two
sequential inserts.
