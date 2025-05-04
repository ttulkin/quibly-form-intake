
/**
 * CandidateIntake.tsx
 * 
 * This is a placeholder for the candidate intake form page.
 * It will be fully implemented in a future update.
 */

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";

const CandidateIntake = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <Card className="w-full max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Join Quibly as a Candidate</CardTitle>
          <CardDescription>
            Submit your information to be connected with companies looking for your skills
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
            <h3 className="text-sm font-medium text-amber-800">Coming Soon</h3>
            <p className="text-sm text-amber-700 mt-1">
              The candidate intake form is currently under development. Please check back soon!
            </p>
          </div>
          
          <p className="text-gray-600 mb-4">
            As a candidate on Quibly, you'll be able to:
          </p>
          <ul className="list-disc pl-5 space-y-2 text-gray-600 mb-6">
            <li>Create a profile showcasing your skills and experience</li>
            <li>Get matched with companies looking for your specific skill set</li>
            <li>Receive competitive offers from vetted companies</li>
            <li>Enjoy a streamlined hiring process</li>
          </ul>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" asChild>
            <Link to="/login">
              Already registered? Sign in
            </Link>
          </Button>
          <Button asChild>
            <Link to="/">
              Return Home
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default CandidateIntake;
