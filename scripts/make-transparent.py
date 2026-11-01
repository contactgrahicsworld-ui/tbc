from PIL import Image, ImageFilter
import numpy as np

# Open the original logo
img = Image.open('/home/z/my-project/upload/TALKIK LOGO.png').convert('RGBA')
width, height = img.size
pixels = np.array(img)

# The logo is circular on a white/near-white background
# We need to remove everything outside the circular badge

# Step 1: Detect the circular badge boundary
# Sample multiple edge points to find the circle
center_x, center_y = width // 2, height // 2

# Find approximate radius by scanning from center outward
radius = 0
for r in range(center_x, 0, -1):
    # Check if this radius has significant non-white content
    sample_y = center_y
    sample_x = r
    if sample_x < width:
        px = pixels[sample_y, sample_x, :3]
        if np.mean(px) < 240:  # Non-white pixel found
            radius = r
            break

print(f"Image size: {width}x{height}")
print(f"Center: ({center_x}, {center_y})")
print(f"Approximate badge radius: {radius}")

# Step 2: Create a circular mask with some padding
# The badge has a circular border - keep everything inside it
# Add a small margin to ensure we don't cut into the badge
margin = 15
effective_radius = radius + margin if radius > 0 else min(width, height) // 2 - 20

# Create distance-based alpha
y_coords, x_coords = np.ogrid[:height, :width]
dist_from_center = np.sqrt((x_coords - center_x) ** 2 + (y_coords - center_y) ** 2)

# Inside the circle: fully opaque
# Outside the circle: transparent
# Near the edge: smooth falloff
edge_width = 8  # pixels for smooth edge
alpha = np.clip(
    (effective_radius - dist_from_center) / edge_width * 255,
    0, 255
).astype(np.uint8)

# Step 3: Also remove any remaining white pixels INSIDE the circle
# that are clearly background (not part of the logo design)
# This handles white spaces within the badge design that should remain
# We only want to make truly background-white areas transparent

# For inside the badge, check if pixels are very close to pure white
inside_mask = dist_from_center < (effective_radius - edge_width)
white_inside = (
    (pixels[:, :, 0] > 250) &
    (pixels[:, :, 1] > 250) &
    (pixels[:, :, 2] > 250) &
    inside_mask
)

# For white areas inside the badge, we keep them semi-visible
# (they might be intentional design elements)
# So we only make OUTSIDE transparent
pixels[:, :, 3] = alpha

# Step 4: Also aggressively remove near-white background OUTSIDE the badge
# Check corners and edges specifically
outside_mask = dist_from_center > effective_radius
near_white_outside = (
    (pixels[:, :, 0] > 230) &
    (pixels[:, :, 1] > 230) &
    (pixels[:, :, 2] > 230) &
    outside_mask
)
pixels[near_white_outside, 3] = 0

# Save
result = Image.fromarray(pixels, 'RGBA')
result.save('/home/z/my-project/public/tbc-logo.png', 'PNG')

# Verify
non_transparent = np.count_nonzero(pixels[:, :, 3] > 0)
total = width * height
print(f"Transparent logo saved!")
print(f"Non-transparent pixels: {non_transparent} / {total} ({non_transparent/total*100:.1f}%)")
print(f"Effectively transparent outside the badge circle")
