import pandas as pd
import geopandas as gpd

# Load the housing data (CSV)
housing_df = pd.read_csv('data/TN_C_Data_copy.csv')

# Load the Census GeoJSON data
census_gdf = gpd.read_file('data/TN_Census_copy.geojson')

# Normalize the GEOID in both datasets
# Remove the "1400000US" prefix from the housing GEOID to match with census GEOID
housing_df['GEO_ID'] = housing_df['GEO_ID'].str.replace('^1400000US', '', regex=True)

# Merge the datasets on GEOID
merged_df = housing_df.merge(census_gdf, left_on='GEO_ID', right_on='GEOID', how='inner')


# Now, you have the merged data. You can export it as CSV or GeoJSON
merged_df.to_csv('data/merged_data.csv', index=False)

# If you want to save as GeoJSON:
merged_gdf = gpd.GeoDataFrame(merged_df, geometry=census_gdf.geometry)
merged_gdf.to_file('data/merged_data.geojson', driver='GeoJSON')

print("Data merged and saved successfully.")

import json

# Load the GeoJSON data using the json module
with open(file_path) as f:
    data = json.load(f)

# Print out the keys of the loaded JSON data to ensure the structure
print(data.keys())  # Should show something like 'type' and 'features'


import geopandas as gpd

# Convert the loaded JSON data into a GeoDataFrame
census_gdf = gpd.GeoDataFrame.from_features(data['features'])

# Check the first few rows of the GeoDataFrame
print(census_gdf.head())

# Normalize the GEOID in housing data (removing the "1400000US" prefix)
housing_df['GEO_ID'] = housing_df['GEO_ID'].str.replace('^1400000US', '', regex=True)

# Merge the housing data with the census GeoDataFrame based on GEOID
merged_gdf = census_gdf.merge(housing_df, left_on='GEOID', right_on='GEO_ID', how='inner')

# Check the first few rows of the merged data
print(merged_gdf.head())

# Save the merged data to CSV
merged_gdf.to_csv('data/merged_data.csv', index=False)
# Save the merged data to GeoJSON
merged_gdf.to_file('data/merged_data.geojson', driver='GeoJSON')
