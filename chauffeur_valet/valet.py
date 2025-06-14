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

@frappe.whitelist()
def get_service_area():
    """Get the service area for the current user from Supplier DocType"""
    try:
        user = frappe.session.user
        
        # Get supplier linked to current user
        custom_serviceable_city, custom_serviceable_zone = frappe.get_value(
            "Supplier",
            {"custom_user": user},
            ["custom_serviceable_city", "custom_serviceable_zone"]
        )
        
        if not custom_serviceable_city or not custom_serviceable_zone:
            return {"success": False, "message": "No supplier found for this user."}
            
        
        return {
            "success": True,
            "data": {
                "city": custom_serviceable_city,
                "zone": custom_serviceable_zone
            }
        }
    except Exception as e:
        return {"success": False, "message": str(e)}

@frappe.whitelist()
def update_service_area(cities=None, zones=None):
    """Update the service area for the current user in Supplier DocType"""
    try:
        user = frappe.session.user
        
        # Convert string inputs to lists if they're not None
        if isinstance(cities, str):
            cities = frappe.parse_json(cities)
        if isinstance(zones, str):
            zones = frappe.parse_json(zones)
            
        # Get supplier linked to current user
        supplier = frappe.get_all(
            "Supplier",
            filters={"user": user},
            fields=["name"]
        )
        
        if not supplier:
            return {"success": False, "message": "No supplier found for this user."}
            
        supplier = frappe.get_doc("Supplier", supplier[0].name)
        
        # Update the custom fields
        supplier.custom_serviceable_city = frappe.as_json(cities) if cities else None
        supplier.custom_serviceable_zone = frappe.as_json(zones) if zones else None
        
        supplier.save()
        return {"success": True, "message": "Service area updated successfully."}
    except Exception as e:
        return {"success": False, "message": str(e)} 