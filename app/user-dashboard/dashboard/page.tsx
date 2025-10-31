"use client";

import { useAccount } from 'wagmi';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useDisconnect } from 'wagmi';

export default function DashboardPage() {
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const router = useRouter();

  // Redirect to home if not connected
  useEffect(() => {
    if (!isConnected) {
      router.push('/');
    }
  }, [isConnected, router]);

  if (!isConnected) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Redirecting...</p>
      </div>
    );
  }

  // Format the address for display
  const formattedAddress = `${address?.substring(0, 6)}...${address?.substring(address.length - 4)}`;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <div className="flex items-center space-x-4">
            <div className="px-4 py-2 bg-white rounded-lg shadow-sm border border-gray-200">
              <span className="text-sm font-medium text-gray-500">Connected as:</span>{' '}
              <span className="font-mono text-sm">{formattedAddress}</span>
            </div>
            <Button 
              variant="outline" 
              onClick={() => {
                disconnect();
                router.push('/');
              }}
            >
              Disconnect Wallet
            </Button>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Overview Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Account Overview</CardTitle>
              <CardDescription>Your wallet activity and status</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500">Wallet Address</p>
                  <p className="font-mono text-sm break-all">{address}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Network</p>
                  <p>Ethereum Mainnet</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quick Actions</CardTitle>
              <CardDescription>Manage your account</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button className="w-full" disabled>
                View Loan History
              </Button>
              <Button className="w-full" variant="outline" disabled>
                View Active Loans
              </Button>
              <Button className="w-full" variant="outline" disabled>
                Transaction History
              </Button>
            </CardContent>
          </Card>

          {/* Stats Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Your Stats</CardTitle>
              <CardDescription>Your activity and performance</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Total Loans</span>
                <span>0</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Active Loans</span>
                <span>0</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Repaid</span>
                <span>$0.00</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
