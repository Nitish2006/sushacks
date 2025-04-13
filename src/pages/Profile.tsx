import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, LogOut, Save, Settings, X } from 'lucide-react';
import NavBar from '@/components/NavBar';
import CardSpotlight from '@/components/CardSpotlight';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';

const indianStates = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat", 
  "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", 
  "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan", 
  "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal",
  "Andaman and Nicobar Islands", "Chandigarh", "Dadra and Nagar Haveli and Daman and Diu", 
  "Delhi", "Jammu and Kashmir", "Ladakh", "Lakshadweep", "Puducherry"
];

// Mock user data
const mockUser = {
  fullName: "Aarav Sharma",
  email: "aarav.sharma@example.com",
  bio: "Travel enthusiast who loves exploring new cultures, trying local food, and going on adventures. Always looking for budget-friendly options to make the most of my trips.",
  location: {
    state: "Maharashtra",
    district: "Mumbai"
  },
  profileImage: "https://randomuser.me/api/portraits/men/36.jpg",
  images: [
    "https://images.unsplash.com/photo-1506461883276-594a12b11cf3?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200&q=80",
    "https://images.unsplash.com/photo-1523478482487-1eed2b3d9939?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200&q=80",
    "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200&q=80"
  ]
};

// Districts mapping (simplified)
const districtsByState: Record<string, string[]> = {
  "Maharashtra": ["Mumbai", "Pune", "Nagpur", "Thane", "Nashik"],
  "Karnataka": ["Bangalore", "Mysore", "Hubli", "Mangalore", "Belgaum"],
  "Tamil Nadu": ["Chennai", "Coimbatore", "Madurai", "Salem", "Tiruchirappalli"],
  // Add districts for other states as needed
};

const Profile = () => {
  const [userData, setUserData] = useState(mockUser);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editData, setEditData] = useState(mockUser);
  const [isLoading, setIsLoading] = useState(false);
  const [previewProfileImage, setPreviewProfileImage] = useState<string | null>(null);
  const [newImages, setNewImages] = useState<File[]>([]);
  const [availableDistricts, setAvailableDistricts] = useState(districtsByState[mockUser.location.state] || []);
  
  const profileImageInputRef = useRef<HTMLInputElement>(null);
  const imagesInputRef = useRef<HTMLInputElement>(null);
  
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleStateChange = (state: string) => {
    setEditData({
      ...editData,
      location: {
        state,
        district: '' // Reset district when state changes
      }
    });
    
    setAvailableDistricts(districtsByState[state] || []);
  };

  const handleDistrictChange = (district: string) => {
    setEditData({
      ...editData,
      location: {
        ...editData.location,
        district
      }
    });
  };

  const handleProfileImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setPreviewProfileImage(imageUrl);
    }
  };

  const handleImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      setNewImages(Array.from(files));
    }
  };

  const handleEditToggle = () => {
    if (isEditMode) {
      // Cancel edit mode
      setEditData(userData);
      setPreviewProfileImage(null);
      setNewImages([]);
      setIsEditMode(false);
    } else {
      // Enter edit mode
      setEditData({ ...userData });
      setIsEditMode(true);
    }
  };

  const handleSaveChanges = () => {
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      // Update user data
      const updatedUserData = { ...editData };
      
      // Add newly uploaded images
      if (newImages.length > 0) {
        const newImageUrls = newImages.map((_, index) => 
          // Mock image URL for new uploads
          `https://images.unsplash.com/photo-${500000000 + index}?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200&q=80`
        );
        updatedUserData.images = [...userData.images, ...newImageUrls];
      }
      
      // Update profile image if changed
      if (previewProfileImage) {
        updatedUserData.profileImage = previewProfileImage;
      }
      
      setUserData(updatedUserData);
      setIsEditMode(false);
      setIsLoading(false);
      
      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated.",
      });
    }, 1500);
  };

  const handleSignOut = () => {
    toast({
      title: "Signed out",
      description: "You have been successfully signed out.",
    });
    
    navigate('/signin');
  };

  const handleRemoveImage = (index: number) => {
    setEditData({
      ...editData,
      images: editData.images.filter((_, i) => i !== index)
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <NavBar />
      
      <div className="max-w-5xl mx-auto px-4 py-24">
        <h1 className="text-3xl font-bold mb-8">My Profile</h1>
        
        <CardSpotlight className="bg-white dark:bg-gray-800 rounded-2xl shadow-md overflow-hidden">
          <div className="p-6 md:p-8">
            <div className="flex flex-col md:flex-row gap-8">
              {/* Profile Image Section */}
              <div className="flex flex-col items-center">
                <div className="relative w-36 h-36 rounded-full overflow-hidden mb-4">
                  <img
                    src={previewProfileImage || userData.profileImage}
                    alt={userData.fullName}
                    className="w-full h-full object-cover"
                  />
                  {isEditMode && (
                    <button
                      onClick={() => profileImageInputRef.current?.click()}
                      className="absolute inset-0 bg-black/50 flex items-center justify-center text-white opacity-0 hover:opacity-100 transition-opacity"
                    >
                      <Camera className="h-8 w-8" />
                      <input
                        ref={profileImageInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleProfileImageChange}
                      />
                    </button>
                  )}
                </div>
                
                <div className="flex gap-2 mt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleEditToggle}
                  >
                    {isEditMode ? (
                      <>
                        <X className="h-4 w-4 mr-1" />
                        Cancel
                      </>
                    ) : (
                      <>
                        <Settings className="h-4 w-4 mr-1" />
                        Edit Profile
                      </>
                    )}
                  </Button>
                  
                  {isEditMode ? (
                    <Button
                      size="sm"
                      onClick={handleSaveChanges}
                      disabled={isLoading}
                    >
                      <Save className="h-4 w-4 mr-1" />
                      {isLoading ? "Saving..." : "Save"}
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={handleSignOut}
                    >
                      <LogOut className="h-4 w-4 mr-1" />
                      Sign Out
                    </Button>
                  )}
                </div>
              </div>
              
              {/* User Information Section */}
              <div className="flex-1 space-y-4">
                {isEditMode ? (
                  <>
                    <div>
                      <Label htmlFor="fullName">Full Name</Label>
                      <Input
                        id="fullName"
                        value={editData.fullName}
                        onChange={(e) => setEditData({ ...editData, fullName: e.target.value })}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="bio">Bio</Label>
                      <Textarea
                        id="bio"
                        value={editData.bio}
                        onChange={(e) => setEditData({ ...editData, bio: e.target.value })}
                        rows={4}
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="state">State</Label>
                        <Select 
                          value={editData.location.state} 
                          onValueChange={handleStateChange}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select state" />
                          </SelectTrigger>
                          <SelectContent>
                            {indianStates.map((state) => (
                              <SelectItem key={state} value={state}>
                                {state}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <Label htmlFor="district">District</Label>
                        <Select 
                          value={editData.location.district} 
                          onValueChange={handleDistrictChange}
                          disabled={!editData.location.state}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select district" />
                          </SelectTrigger>
                          <SelectContent>
                            {availableDistricts.map((district) => (
                              <SelectItem key={district} value={district}>
                                {district}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div>
                      <h2 className="text-2xl font-bold">{userData.fullName}</h2>
                      <p className="text-gray-500 dark:text-gray-400">{userData.email}</p>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-semibold mb-2">About Me</h3>
                      <p className="text-gray-600 dark:text-gray-300">{userData.bio}</p>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Location</h3>
                      <p className="text-gray-600 dark:text-gray-300">
                        {userData.location.district}, {userData.location.state}
                      </p>
                    </div>
                  </>
                )}
              </div>
            </div>
            
            {/* Photos Section */}
            <div className="mt-10">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold">My Photos</h3>
                {isEditMode && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => imagesInputRef.current?.click()}
                  >
                    <Camera className="h-4 w-4 mr-1" />
                    Add Photos
                    <input
                      ref={imagesInputRef}
                      type="file"
                      accept="image/*"
                      multiple
                      className="hidden"
                      onChange={handleImagesChange}
                    />
                  </Button>
                )}
              </div>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {/* Existing images */}
                {editData.images.map((image, index) => (
                  <div key={index} className="relative rounded-lg overflow-hidden h-40">
                    <img
                      src={image}
                      alt={`Travel photo ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                    {isEditMode && (
                      <button
                        onClick={() => handleRemoveImage(index)}
                        className="absolute top-2 right-2 rounded-full bg-red-500 text-white p-1"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                ))}
                
                {/* New images preview */}
                {newImages.map((file, index) => (
                  <div key={`new-${index}`} className="relative rounded-lg overflow-hidden h-40">
                    <img
                      src={URL.createObjectURL(file)}
                      alt={`New travel photo ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <button
                      onClick={() => setNewImages(newImages.filter((_, i) => i !== index))}
                      className="absolute top-2 right-2 rounded-full bg-red-500 text-white p-1"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardSpotlight>
      </div>
    </div>
  );
};

export default Profile;
