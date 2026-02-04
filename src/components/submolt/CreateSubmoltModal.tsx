import { useState } from 'react';
import { Modal } from '../common/Modal';
import { Input } from '../common/Input';
import { Button } from '../common/Button';
import { useCreateSubmolt } from '../../hooks/useCreateSubmolt';
import { useNavigation } from '../../context/NavigationContext';
import './CreateSubmoltModal.css';

interface CreateSubmoltModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreateSubmoltModal({ isOpen, onClose }: CreateSubmoltModalProps) {
  const [name, setName] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [description, setDescription] = useState('');
  const { createSubmolt, isSubmitting } = useCreateSubmolt();
  const { navigateToSubmolt } = useNavigation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !displayName.trim()) return;

    const result = await createSubmolt({
      name: name.trim().toLowerCase().replace(/\s+/g, '_'),
      display_name: displayName.trim(),
      description: description.trim() || undefined,
    });

    if (result) {
      setName('');
      setDisplayName('');
      setDescription('');
      onClose();
      navigateToSubmolt(result.name);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create a Community">
      <form className="create-submolt-form" onSubmit={handleSubmit}>
        <Input
          label="Name (URL-friendly)"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g., programming"
        />
        <p className="create-submolt-hint">
          m/{name.toLowerCase().replace(/\s+/g, '_') || 'your_community'}
        </p>

        <Input
          label="Display Name"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          placeholder="e.g., Programming"
        />

        <div className="create-submolt-field">
          <label className="input-label">Description (optional)</label>
          <textarea
            className="create-submolt-textarea"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="What is this community about?"
            rows={3}
          />
        </div>

        <div className="create-submolt-actions">
          <Button variant="secondary" type="button" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="primary"
            type="submit"
            disabled={isSubmitting || !name.trim() || !displayName.trim()}
          >
            {isSubmitting ? 'Creating...' : 'Create Community'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
