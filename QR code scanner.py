import cv2
from pyzbar.pyzbar import decode

def read_qr_code(image_path):
    """
    Reads QR codes from a given image file.

    Args:
        image_path (str): The path to the image file.

    Returns:
        list: A list of decoded data strings from the QR codes found.
    """
    try:
        # Read the image using OpenCV
        image = cv2.imread(image_path)
        if image is None:
            print(f"Error: Could not read the image file at '{image_path}'")
            return []

        # Use pyzbar to detect and decode QR codes
        decoded_objects = decode(image)
        
        if not decoded_objects:
            print("No QR code found in the image.")
            return []

        decoded_data_list = []
        for obj in decoded_objects:
            # The data is in bytes, so decode it to a string
            data = obj.data.decode('utf-8')
            decoded_data_list.append(data)
            
            print(f"Detected QR Code!")
            print(f"  Type: {obj.type}")
            print(f"  Data: {data}\n")

            # Get the bounding box location and draw it on the image
            points = obj.polygon
            if len(points) > 4:
                hull = cv2.convexHull([point for point in points])
                cv2.polylines(image, [hull], True, (0, 255, 0), 3)
            else:
                cv2.polylines(image, [points], True, (0, 255, 0), 3)

        # Display the image with the detected QR code
        cv2.imshow("Detected QR Code", image)
        cv2.waitKey(0)  # Wait for a key press to close the image window
        cv2.destroyAllWindows()
        
        return decoded_data_list

    except Exception as e:
        print(f"An error occurred: {e}")
        return []

# --- Main execution ---
if __name__ == "__main__":
    # Replace 'my_qr_code.png' with the path to your QR code image
    image_file = 'my_qr_code.png' 
    read_qr_code(image_file)