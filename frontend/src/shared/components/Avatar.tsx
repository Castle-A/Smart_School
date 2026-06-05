interface AvatarProps {
    firstName: string;
    lastName: string;
    imageUrl?: string;
    size?: 'sm' | 'md' | 'lg' | 'xl';
    className?: string;
}

const Avatar = ({ firstName, lastName, imageUrl, size = 'md', className = '' }: AvatarProps) => {
    const getInitials = () => {
        const firstInitial = firstName?.charAt(0)?.toUpperCase() || '';
        const lastInitial = lastName?.charAt(0)?.toUpperCase() || '';
        return `${firstInitial}${lastInitial}`;
    };

    const sizeClasses = {
        sm: 'w-8 h-8 text-xs',
        md: 'w-10 h-10 text-sm',
        lg: 'w-12 h-12 text-base',
        xl: 'w-16 h-16 text-lg',
    };

    const bgColors = [
        'bg-indigo-500',
        'bg-purple-500',
        'bg-pink-500',
        'bg-blue-500',
        'bg-emerald-500',
        'bg-amber-500',
    ];

    // Generate consistent color based on name
    const getBackgroundColor = () => {
        const nameString = `${firstName}${lastName}`;
        const index = nameString.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % bgColors.length;
        return bgColors[index];
    };

    if (imageUrl) {
        return (
            <img
                src={imageUrl}
                alt={`${firstName} ${lastName}`}
                className={`${sizeClasses[size]} rounded-full object-cover ${className}`}
            />
        );
    }

    return (
        <div
            className={`${sizeClasses[size]} ${getBackgroundColor()} rounded-full flex items-center justify-center text-white font-semibold ${className}`}
        >
            {getInitials()}
        </div>
    );
};

export default Avatar;
