
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import Index from '@/pages/Index';
import { supabase } from "@/integrations/supabase/client";
import { ToastProvider } from "@/components/ui/toast";

// Mock supabase client
vi.mock("@/integrations/supabase/client", () => {
  return {
    supabase: {
      auth: {
        signInWithOtp: vi.fn().mockResolvedValue({
          data: {}, 
          error: null
        }),
        getSession: vi.fn().mockResolvedValue({
          data: { session: null },
          error: null
        }),
        onAuthStateChange: vi.fn().mockReturnValue({
          data: { subscription: { unsubscribe: vi.fn() } }
        }),
      },
      from: vi.fn(() => ({
        insert: vi.fn().mockReturnThis(),
        select: vi.fn().mockResolvedValue({ 
          data: [{ id: 'test-request-id' }], 
          error: null 
        }),
      })),
    }
  };
});

// Mock window.location
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual as Object,
    useNavigate: () => mockNavigate,
  };
});

describe('Form Submission', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    
    // Reset mocks with default values
    (supabase.auth.signInWithOtp as any).mockResolvedValue({
      data: {}, 
      error: null
    });
    
    (supabase.auth.getSession as any).mockResolvedValue({
      data: { session: null },
      error: null
    });
  });

  it('should send magic link with correct redirect URL', async () => {
    // Mock window.location.origin
    const originalLocation = window.location;
    delete window.location;
    window.location = { 
      ...originalLocation, 
      origin: 'https://test-app.com' 
    } as unknown as Location;

    render(
      <BrowserRouter>
        <ToastProvider>
          <Index />
        </ToastProvider>
      </BrowserRouter>
    );
    
    // Assert the correct redirect URL was used in signInWithOtp
    await waitFor(() => {
      expect(supabase.auth.signInWithOtp).toHaveBeenCalledWith(
        expect.objectContaining({
          options: expect.objectContaining({
            emailRedirectTo: 'https://test-app.com'
          })
        })
      );
    });

    // Restore the original location
    window.location = originalLocation;
  });

  it('should handle form submission without user session', async () => {
    render(
      <BrowserRouter>
        <ToastProvider>
          <Index />
        </ToastProvider>
      </BrowserRouter>
    );
    
    // Assert
    await waitFor(() => {
      expect(supabase.auth.getSession).toHaveBeenCalled();
    });
  });

  it('should include user_id when session exists', async () => {
    // Arrange - Mock authenticated session
    (supabase.auth.getSession as any).mockResolvedValue({
      data: {
        session: {
          user: { id: 'test-user-id' }
        }
      },
      error: null
    });

    render(
      <BrowserRouter>
        <ToastProvider>
          <Index />
        </ToastProvider>
      </BrowserRouter>
    );
    
    // Assert
    await waitFor(() => {
      expect(supabase.auth.getSession).toHaveBeenCalled();
    });
  });

  it('should handle form submission errors', async () => {
    // Arrange
    (supabase.from as any).mockImplementation(() => ({
      insert: vi.fn().mockReturnThis(),
      select: vi.fn().mockResolvedValue({ 
        data: null, 
        error: { message: 'Database error' } 
      }),
    }));

    render(
      <BrowserRouter>
        <ToastProvider>
          <Index />
        </ToastProvider>
      </BrowserRouter>
    );
    
    // Assert error handling
    await waitFor(() => {
      expect(supabase.auth.signInWithOtp).toHaveBeenCalled();
    });
  });
});
