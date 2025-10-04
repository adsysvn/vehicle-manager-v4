import React, { useState } from 'react';
import { Plus, Search, FileText, CheckCircle, XCircle, Clock, User, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Document {
  id: string;
  title: string;
  type: string;
  submittedBy: string;
  submittedDate: string;
  status: 'Chờ duyệt' | 'Đã duyệt' | 'Từ chối' | 'Đang xử lý';
  approver?: string;
  approvedDate?: string;
  notes?: string;
}

const DocumentApproval = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState<Document | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    type: '',
    content: '',
    notes: ''
  });

  const documents: Document[] = [
    {
      id: 'DOC001',
      title: 'Đơn xin nghỉ phép',
      type: 'Nghỉ phép',
      submittedBy: 'Nguyễn Văn A',
      submittedDate: '2024-01-10',
      status: 'Chờ duyệt'
    },
    {
      id: 'DOC002',
      title: 'Đề xuất tăng lương',
      type: 'Đề xuất nhân sự',
      submittedBy: 'Phạm Thị C',
      submittedDate: '2024-01-08',
      status: 'Đang xử lý',
      approver: 'Trần Văn B'
    },
    {
      id: 'DOC003',
      title: 'Báo cáo chi phí tháng 12',
      type: 'Báo cáo tài chính',
      submittedBy: 'Lê Văn D',
      submittedDate: '2024-01-05',
      status: 'Đã duyệt',
      approver: 'Trần Văn B',
      approvedDate: '2024-01-06',
      notes: 'Đã phê duyệt'
    },
    {
      id: 'DOC004',
      title: 'Đơn xin tạm ứng',
      type: 'Tài chính',
      submittedBy: 'Hoàng Văn E',
      submittedDate: '2024-01-03',
      status: 'Từ chối',
      approver: 'Trần Văn B',
      approvedDate: '2024-01-04',
      notes: 'Không đủ điều kiện'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Đã duyệt':
        return 'bg-green-500';
      case 'Từ chối':
        return 'bg-red-500';
      case 'Đang xử lý':
        return 'bg-blue-500';
      default:
        return 'bg-yellow-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Đã duyệt':
        return <CheckCircle className="w-4 h-4" />;
      case 'Từ chối':
        return <XCircle className="w-4 h-4" />;
      case 'Đang xử lý':
        return <Clock className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Submit document:', formData);
    setIsCreateOpen(false);
    setFormData({
      title: '',
      type: '',
      content: '',
      notes: ''
    });
  };

  const handleReview = (doc: Document, action: 'approve' | 'reject') => {
    console.log(`${action} document:`, doc);
    setIsReviewOpen(false);
    setSelectedDoc(null);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Trình ký</h1>
          <p className="text-muted-foreground">Quản lý tài liệu và quy trình phê duyệt</p>
        </div>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Trình tài liệu mới
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Trình tài liệu mới</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label>Tiêu đề tài liệu</Label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Nhập tiêu đề tài liệu"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Loại tài liệu</Label>
                <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn loại tài liệu" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="nghi-phep">Nghỉ phép</SelectItem>
                    <SelectItem value="de-xuat">Đề xuất nhân sự</SelectItem>
                    <SelectItem value="bao-cao">Báo cáo</SelectItem>
                    <SelectItem value="tai-chinh">Tài chính</SelectItem>
                    <SelectItem value="khac">Khác</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Nội dung</Label>
                <Textarea
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="Nhập nội dung chi tiết"
                  rows={6}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Ghi chú</Label>
                <Textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Ghi chú thêm (nếu có)"
                  rows={2}
                />
              </div>

              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setIsCreateOpen(false)}>
                  Hủy
                </Button>
                <Button type="submit">Trình ký</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="p-4">
        <div className="flex gap-4 mb-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Tìm kiếm tài liệu..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Mã</TableHead>
              <TableHead>Tiêu đề</TableHead>
              <TableHead>Loại</TableHead>
              <TableHead>Người trình</TableHead>
              <TableHead>Ngày trình</TableHead>
              <TableHead>Người duyệt</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead>Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {documents.map((doc) => (
              <TableRow key={doc.id}>
                <TableCell className="font-medium">{doc.id}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    {doc.title}
                  </div>
                </TableCell>
                <TableCell>{doc.type}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    {doc.submittedBy}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    {doc.submittedDate}
                  </div>
                </TableCell>
                <TableCell>{doc.approver || '-'}</TableCell>
                <TableCell>
                  <Badge className={`${getStatusColor(doc.status)} flex items-center gap-1 w-fit`}>
                    {getStatusIcon(doc.status)}
                    {doc.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  {doc.status === 'Chờ duyệt' && (
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setSelectedDoc(doc);
                          setIsReviewOpen(true);
                        }}
                      >
                        Xem
                      </Button>
                    </div>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      <Dialog open={isReviewOpen} onOpenChange={setIsReviewOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xét duyệt tài liệu</DialogTitle>
          </DialogHeader>
          {selectedDoc && (
            <div className="space-y-4">
              <div>
                <Label>Tiêu đề</Label>
                <p className="text-sm">{selectedDoc.title}</p>
              </div>
              <div>
                <Label>Người trình</Label>
                <p className="text-sm">{selectedDoc.submittedBy}</p>
              </div>
              <div>
                <Label>Ngày trình</Label>
                <p className="text-sm">{selectedDoc.submittedDate}</p>
              </div>
              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={() => handleReview(selectedDoc, 'reject')}>
                  <XCircle className="w-4 h-4 mr-2" />
                  Từ chối
                </Button>
                <Button onClick={() => handleReview(selectedDoc, 'approve')}>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Phê duyệt
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DocumentApproval;
