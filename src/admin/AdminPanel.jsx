import { useNavigate } from 'react-router-dom';

function AdminPanel() {
    const navigate = useNavigate();

    return (
        <div className="p-6">
            <Typography variant="h4" className="mb-6">Admin Panel</Typography>
            <Button
                onClick={() => navigate('/admin/user-management')}
                className="mb-4"
                color="blue"
            >
                User Management
            </Button>
            <Button
                onClick={() => navigate('/admin/ranking-moderation')}
                className="mb-4"
                color="blue"
            >
                Ranking Moderation
            </Button>
            <Button
                onClick={() => navigate('/admin/test-management')}
                className="mb-4"
                color="blue"
            >
                Test Management
            </Button>
        </div>
    );
}

export default AdminPanel;
