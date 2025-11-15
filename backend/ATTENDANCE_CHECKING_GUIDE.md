# 🎫 Attendance Checking System Guide

## Overview

The attendance checking system allows event organizers to check-in attendees by scanning their QR codes or manually entering ticket codes. The system validates tickets, prevents duplicate check-ins, and tracks attendance data.

---

## 🚀 Quick Start

### **1. Check-In an Attendee (QR Code Scan)**

```bash
POST /attendance/check-in
Authorization: Bearer <organizer_token>
Content-Type: application/json

{
  "ticketCode": "A3K9L2M4P7Q1",
  "eventId": "event-uuid",
  "method": "qr",
  "checkedInBy": "staff-uuid",
  "metadata": {
    "location": "Main Entrance",
    "device": "Scanner #1"
  }
}
```

**Response (Success):**
```json
{
  "success": true,
  "message": "Check-in successful",
  "attendance": {
    "id": "attendance-uuid",
    "ticketId": "ticket-uuid",
    "eventId": "event-uuid",
    "checkedInAt": "2025-06-15T09:30:00Z",
    "method": "qr"
  },
  "ticketInfo": {
    "ticketType": "General Admission",
    "ownerName": "John Doe",
    "eventTitle": "Tech Conference 2025"
  }
}
```

**Response (Already Checked In):**
```json
{
  "success": false,
  "message": "Already checked in at 6/15/2025, 9:30:00 AM"
}
```

**Response (Invalid Ticket):**
```json
{
  "success": false,
  "message": "Invalid ticket code"
}
```

---

## 📱 API Endpoints

### **1. Check-In Endpoint**

**POST** `/attendance/check-in`

**Purpose:** Check-in an attendee by scanning their QR code

**Auth:** Organizer or Admin only

**Body:**
```typescript
{
  ticketCode: string;      // From QR code scan
  eventId: string;         // Event UUID
  method?: 'qr' | 'nfc' | 'manual';  // Default: 'qr'
  checkedInBy?: string;    // Staff member UUID
  metadata?: object;       // Additional info
}
```

**Use Cases:**
- QR code scanner at event entrance
- Mobile app for staff check-ins
- Manual ticket verification

---

### **2. Validate Ticket (Preview)**

**GET** `/attendance/validate/:ticketCode/:eventId`

**Purpose:** Check if a ticket is valid WITHOUT actually checking in

**Auth:** Organizer or Admin only

**Example:**
```bash
GET /attendance/validate/A3K9L2M4P7Q1/event-uuid
Authorization: Bearer <token>
```

**Response:**
```json
{
  "valid": true,
  "message": "Ticket is valid",
  "ticketInfo": {
    "ticketType": "VIP Pass",
    "ownerName": "Jane Smith",
    "eventTitle": "Tech Conference 2025",
    "orderNumber": "order-uuid",
    "seatInfo": "Section A - Row 5 - Seat 12"
  }
}
```

**Use Cases:**
- Preview ticket before check-in
- Verify ticket authenticity
- Check seat assignments

---

### **3. Get Event Attendance**

**GET** `/attendance/event/:eventId`

**Purpose:** Get all check-ins for an event

**Auth:** Organizer or Admin only

**Response:**
```json
[
  {
    "id": "attendance-uuid",
    "ticketId": "ticket-uuid",
    "eventId": "event-uuid",
    "checkedInAt": "2025-06-15T09:30:00Z",
    "method": "qr",
    "ticket": {
      "code": "A3K9L2M4P7Q1",
      "owner": {
        "name": "John Doe",
        "email": "john@example.com"
      }
    }
  }
]
```

---

### **4. Get Attendance Count**

**GET** `/attendance/event/:eventId/count`

**Purpose:** Get total number of check-ins

**Response:**
```json
{
  "count": 245
}
```

---

### **5. Get Attendance Stats**

**GET** `/attendance/event/:eventId/stats`

**Purpose:** Get attendance statistics

**Response:**
```json
{
  "totalCheckIns": 245,
  "averageCheckInTime": "N/A"
}
```

---

## 🔍 Validation Rules

### **Ticket Validation:**

✅ **Valid Ticket:**
- Ticket code exists
- Belongs to the specified event
- Status is ACTIVE or USED (not CANCELLED)
- Not already checked in

❌ **Invalid Ticket:**
- Ticket code doesn't exist
- Wrong event
- Ticket cancelled
- Already checked in

---

## 🎯 Check-In Flow

```
┌─────────────────────────────────────┐
│  1. Scan QR Code                    │
│     (Get ticket code)               │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│  2. Send to API                     │
│     POST /attendance/check-in       │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│  3. Validate Ticket                 │
│     - Check if exists               │
│     - Verify event match            │
│     - Check status                  │
│     - Check if already used         │
└──────────────┬──────────────────────┘
               │
         ┌─────┴─────┐
         │           │
    ✅ Valid    ❌ Invalid
         │           │
         ▼           ▼
┌─────────────┐ ┌─────────────┐
│ 4. Check-In │ │ Show Error  │
│ - Create    │ │ Message     │
│   attendance│ └─────────────┘
│ - Mark      │
│   ticket    │
│   as USED   │
│ - Return    │
│   success   │
└─────────────┘
```

---

## 💻 Implementation Examples

### **Example 1: Simple QR Scanner**

```typescript
// Frontend code
async function scanAndCheckIn(qrCode: string, eventId: string) {
  try {
    const response = await fetch('/attendance/check-in', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        ticketCode: qrCode,
        eventId: eventId,
        method: 'qr'
      })
    });

    const result = await response.json();

    if (result.success) {
      // Show success message
      alert(`✅ Welcome ${result.ticketInfo.ownerName}!`);
      playSuccessSound();
    } else {
      // Show error message
      alert(`❌ ${result.message}`);
      playErrorSound();
    }
  } catch (error) {
    alert('Network error. Please try again.');
  }
}
```

---

### **Example 2: Validate Before Check-In**

```typescript
// Preview ticket info before checking in
async function previewTicket(ticketCode: string, eventId: string) {
  const response = await fetch(
    `/attendance/validate/${ticketCode}/${eventId}`,
    {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }
  );

  const result = await response.json();

  if (result.valid) {
    // Show ticket info
    console.log('Ticket Type:', result.ticketInfo.ticketType);
    console.log('Owner:', result.ticketInfo.ownerName);
    console.log('Seat:', result.ticketInfo.seatInfo);
    
    // Ask for confirmation
    if (confirm('Check in this attendee?')) {
      await checkIn(ticketCode, eventId);
    }
  } else {
    alert(result.message);
  }
}
```

---

### **Example 3: Batch Check-In Stats**

```typescript
// Get real-time attendance stats
async function getAttendanceStats(eventId: string) {
  const [count, attendees] = await Promise.all([
    fetch(`/attendance/event/${eventId}/count`),
    fetch(`/attendance/event/${eventId}`)
  ]);

  const countData = await count.json();
  const attendeesData = await attendees.json();

  console.log(`Total Check-Ins: ${countData.count}`);
  console.log(`Recent Check-Ins:`, attendeesData.slice(0, 10));
}
```

---

## 📊 Check-In Methods

### **1. QR Code (Recommended)**
```json
{
  "method": "qr"
}
```
- Fast and reliable
- No typing errors
- Works with mobile cameras

### **2. NFC**
```json
{
  "method": "nfc"
}
```
- Contactless
- Very fast
- Requires NFC-enabled devices

### **3. Manual Entry**
```json
{
  "method": "manual"
}
```
- Backup option
- For damaged QR codes
- Slower but reliable

---

## 🔒 Security Features

### **1. Duplicate Prevention**
- System checks if ticket already used
- Returns error with check-in time
- Prevents double entry

### **2. Event Validation**
- Ticket must belong to the event
- Prevents ticket reuse across events

### **3. Status Checks**
- Only ACTIVE tickets can check in
- CANCELLED tickets rejected
- USED tickets show when they were used

### **4. Role-Based Access**
- Only Organizers and Admins can check in
- Regular users cannot access endpoints

---

## 📱 Mobile App Integration

### **QR Scanner Setup:**

```typescript
import { BarcodeScanner } from '@capacitor-community/barcode-scanner';

async function startScanning(eventId: string) {
  // Request camera permission
  await BarcodeScanner.checkPermission({ force: true });

  // Start scanning
  BarcodeScanner.hideBackground();
  const result = await BarcodeScanner.startScan();

  if (result.hasContent) {
    // Got ticket code
    await checkIn(result.content, eventId);
  }

  // Stop scanning
  BarcodeScanner.showBackground();
  BarcodeScanner.stopScan();
}
```

---

## 📈 Attendance Dashboard

### **Real-Time Stats:**

```typescript
// Dashboard component
function AttendanceDashboard({ eventId }) {
  const [stats, setStats] = useState({
    total: 0,
    recent: []
  });

  useEffect(() => {
    // Poll every 5 seconds
    const interval = setInterval(async () => {
      const count = await fetch(`/attendance/event/${eventId}/count`);
      const recent = await fetch(`/attendance/event/${eventId}`);
      
      setStats({
        total: await count.json(),
        recent: (await recent.json()).slice(0, 5)
      });
    }, 5000);

    return () => clearInterval(interval);
  }, [eventId]);

  return (
    <div>
      <h2>Total Check-Ins: {stats.total}</h2>
      <h3>Recent:</h3>
      <ul>
        {stats.recent.map(a => (
          <li key={a.id}>
            {a.ticket.owner.name} - {new Date(a.checkedInAt).toLocaleTimeString()}
          </li>
        ))}
      </ul>
    </div>
  );
}
```

---

## 🎯 Best Practices

### **1. Fast Check-In**
- Use QR codes for speed
- Pre-load event data
- Cache ticket validation
- Show immediate feedback

### **2. Offline Support**
- Cache attendee list
- Queue check-ins when offline
- Sync when connection restored

### **3. User Experience**
- Clear success/error messages
- Audio feedback (beep/buzz)
- Visual indicators (green/red)
- Show attendee name on success

### **4. Error Handling**
- Handle network errors gracefully
- Provide manual entry backup
- Log all check-in attempts
- Alert on suspicious activity

---

## 🐛 Troubleshooting

### **Problem: "Invalid ticket code"**
**Solutions:**
- Verify QR code is readable
- Check ticket code manually
- Ensure ticket exists in database
- Try manual entry

### **Problem: "Already checked in"**
**Solutions:**
- Show check-in time to user
- Verify it's not a duplicate ticket
- Check if ticket was refunded/reissued
- Contact support if error

### **Problem: "This ticket is not valid for this event"**
**Solutions:**
- Verify correct event selected
- Check if ticket transferred
- Confirm event ID matches

### **Problem: "Ticket has been cancelled"**
**Solutions:**
- Verify with ticket holder
- Check order status
- Issue new ticket if needed
- Contact support

---

## ✅ Testing Checklist

- [ ] Valid ticket check-in works
- [ ] Duplicate check-in prevented
- [ ] Invalid ticket rejected
- [ ] Cancelled ticket rejected
- [ ] Wrong event ticket rejected
- [ ] QR code scanning works
- [ ] Manual entry works
- [ ] Attendance count accurate
- [ ] Stats endpoint works
- [ ] Real-time updates work

---

## 📞 Support

For issues or questions:
- Check API documentation: `/api/docs`
- Review error messages
- Check server logs
- Contact technical support

---

**Your attendance checking system is now ready to use!** 🎉

Scan QR codes, validate tickets, and track attendance in real-time!
