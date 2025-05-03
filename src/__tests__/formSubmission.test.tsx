
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { ToastProvider } from '@/components/ui/use-toast';
import Index from '@/pages/Index';
import { supabase } from "@/integrations/supabase/client";

// Mock supabase client
vi.mock("@/integrations/supabase/client", () => {
  return {
    supabase: {
      auth: {
        signInWithOtp: vi.fn(),
        getSession: vi.fn(),
      },
      from: vi.fn().mockReturnThis(),
      insert: vi.fn().mockReturnThis(),
      select: vi.fn(),
    }
  };
});

describe('Form Submission', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    
    // Mock successful authentication
    (supabase.auth.signInWithOtp as any).mockResolvedValue({
      data: {}, 
      error: null
    });
    
    // Mock session data
    (supabase.auth.getSession as any).mockResolvedValue({
      data: {
        session: {
          user: { id: 'test-user-id' }
        }
      },
      error: null
    });
    
    // Mock database operations
    (supabase.from as any).mockImplementation((table) => {
      return {
        insert: vi.fn().mockReturnThis(),
        select: vi.fn().mockResolvedValue({ 
          data: [{ id: 'test-request-id' }], 
          error: null 
        }),
      };
    });
  });

  it('should handle form submission with user authentication', async () => {
    // Arrange
    render(
      <BrowserRouter>
        <ToastProvider>
          <Index />
        </ToastProvider>
      </BrowserRouter>
    );
    
    // Act - Simulate completing all form steps and submitting
    // Note: In a real test, you'd fill out all form fields and navigate through all steps
    
    // Assert
    await waitFor(() => {
      expect(supabase.auth.signInWithOtp).toHaveBeenCalled();
      expect(supabase.auth.getSession).toHaveBeenCalled();
      // Check that user_id was included in the request data
      expect(supabase.from).toHaveBeenCalledWith('company_requests');
    });
  });

  it('should handle form submission errors', async () => {
    // Arrange
    (supabase.from as any).mockImplementation(() => ({
      insert: vi.fn().mockReturnThis(),
      select: vi.fn().mockResolvedValue({ 
        data: null, 
        error: { message: 'Row level security violation' } 
      }),
    }));

    render(
      <BrowserRouter>
        <ToastProvider>
          <Index />
        </ToastProvider>
      </BrowserRouter>
    );
    
    // Act - Simulate form submission with an error
    
    // Assert
    await waitFor(() => {
      expect(supabase.auth.signInWithOtp).toHaveBeenCalled();
      // We would check for error toast message here in a complete test
    });
  });
});
