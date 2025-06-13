import frappe

@frappe.whitelist()
def mark_ride_as_viewed(ride_id):
    try:
        ride = frappe.get_doc("Ride", ride_id)
        ride.status = "Viewed"
        ride.save()
        return {"success": True, "message": "Ride marked as viewed."}
    except Exception as e:
        return {"success": False, "message": str(e)}

@frappe.whitelist()
def accept_ride(ride_id):
    try:
        ride = frappe.get_doc("Ride", ride_id)
        ride.status = "Accepted"
        ride.save()
        return {"success": True, "message": "Ride accepted."}
    except Exception as e:
        return {"success": False, "message": str(e)}

@frappe.whitelist()
def ignore_ride(ride_id):
    try:
        ride = frappe.get_doc("Ride", ride_id)
        ride.status = "Ignored"
        ride.save()
        return {"success": True, "message": "Ride ignored."}
    except Exception as e:
        return {"success": False, "message": str(e)}

@frappe.whitelist()
def update_ride_status(ride_id, new_status):
    try:
        ride = frappe.get_doc("Ride", ride_id)
        ride.status = new_status
        ride.save()
        return {"success": True, "message": f"Ride status updated to {new_status}."}
    except Exception as e:
        return {"success": False, "message": str(e)}

@frappe.whitelist()
def start_trip(ride_id, otp):
    try:
        ride = frappe.get_doc("Ride", ride_id)
        # OTP validation logic
        if not hasattr(ride, 'otp') or not ride.otp:
            return {"success": False, "message": "No OTP set for this ride."}
        if str(ride.otp) != str(otp):
            return {"success": False, "message": "Invalid OTP. Please try again."}
        ride.status = "In Progress"
        ride.save()
        return {"success": True, "message": "Trip started."}
    except Exception as e:
        return {"success": False, "message": str(e)} 