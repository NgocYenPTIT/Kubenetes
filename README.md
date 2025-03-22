# Kubernetes Notes

## Cơ bản về Pod và Container

**0)** Bắt trend microservice, pod là trừu tượng hóa của container ? 

**1)** Pod là đơn vị nhỏ nhất của k8s( dù container nhỏ hơn) , nhưng pod là sự trừu tượng hóa của container trong docker , mỗi pod thường ứng với 1 container, case đặc biệt là pod gồm 2 container là 1 container chính và 1 container làm nhiệm vụ log or monitoring) =>> 1 service thường ứng với 1 pod , 1 pod thường ứng với 1 container or thêm 1 container cho logging

**2)** Mỗi pod được cấp địa chỉ IP riêng khi được khởi tạo, pod chết, IP đó mất, ví dụ db chết , backend k thể gọi = IP =>> các appication nên giao tiếp = service bởi service là IP tĩnh, khi container chết và được thay thế bởi container khác, chẳng sao cả, bởi các app sẽ giao tiếp với nhau = IP của service

## Service và Network

**3)** Internal service là những service có thể giao tiếp với nhau trong cùng 1 cluster

**4)** External service là những service có thể giao tiếp với nhau dù khác cluster

**5)** Ingress là tài nguyên đứng phía trước service , mỗi request yêu cầu truy cập tới service bên trong, nó sẽ đi qua ingress trước và ingress điều hướng nó tới service phù hợp, đồng thời ingress có thể làm thêm 1 số thứ

**6)** configMap & secret

**7)** Volume trong k8s tương tự volume trong docker, 2 container thuộc 2 cluster cũng có thể dùng chung volume ? 

## Deployment và Workload

**8)** Trong thực tế sẽ làm việc với Deployment thay vì làm việc với pod , vì Deployment cũng là trừu tượng của pod , nó có thể kiểm soát pod, cấu hình pod, kiểm soát số lượng replicas của pod, cách pod được thay thế, hồi sinh

**9)** Deployment là quá trình clone Node , tọa ra bản copy replica để execute HA

**10)** Deployment phục vụ các service k phải db, db thì cần consistent nên dùng statefulSet, lí do là nếu db chạy mô hình master-slave thì master buộc phải khởi động trước, sau đó slave khởi động sau, deployment làm song song nên k thỏa mãn điều này, state-ful duy trì thứ tự và tên pod

**11)** Service quản lí port, chỉ là giao diện để giao tiếp giữa các service

**12)** Workload là Deployment, StatefulSet,...

## Kubernetes Components

**13)** Kubelet là người quản lí cho mỗi node nó chịu trách nhiệm, nó sẽ báo cáo mọi tình hình sức khỏe, tài nguyên của node cho control plane

**14)** Service là "ý tưởng" về cách kết nối đến ứng dụng, còn kube-proxy là cơ chế kỹ thuật làm cho ý tưởng đó hoạt động được trên thực tế.

**15)** API server là thành phần trung tâm của Kubernetes control plane, đóng vai trò cổng giao tiếp chính cho toàn bộ cluster. Chức năng chính của API server bao gồm phân quyền, quản lí kubectl,...

**16)** Scheduler lên lịch cho pod, quyết định pod được đặt ở node nào nhờ thuật toán, check ram,...

**17)** Controller Manager trong Kubernetes là một thành phần control plane chạy nhiều controller khác nhau trong một quy trình duy nhất. Các controller này thực hiện việc giám sát và điều chỉnh trạng thái của cluster để đảm bảo trạng thái thực tế phù hợp với trạng thái mong muốn, etcd là nơi lưu trữ trạng thái của toàn bộ cluster.

**18)** Container runtime là người thực sự tạo mới container, restart container

## Flow và Quản lý Sự cố

**19)** Flow khi có sự cố 1 pod chết, Kubelet theo dõi tình hình sức khỏe của node, nhận thấy pod chết, cầm request chạy lên api server báo cáo,api server cập nhật etcd(có pod chết), controller manager nhận ra trạng thái này không như mong muốn,quyết định nên tạo pod mới hay restart or làm 1 hành động phản ứng lại nào đó,gửi trả kết quả cho api server,api server lưu thông tin vào etcd,scheduler phát hiện pod chưa có đủ thông tin vị trí node mà nó thuộc về, lên lịch cho vị trí pod mới được xuất hiện,báo lại cho api server, api server update lại thông tin trạng thái các cluster vào etcd, trả kết quả cho kubelet, kubelet cầm kết quả chạy về yêu cầu container runtime tạo mới/restart container,
service như 1 quán bar cố định(k nặng xử lí logic), kube-proxy điều hướng traffic tới container mới, sau đó báo cáo ngược lại cho cấp trên về sự thay đổi được cập nhật thành công,container chết sẽ được kubelet giao cho container runtime xử lí sau( Ví dụ về quản lí quán bar)

**20)** Cả Controller Manager và Kubelet(let chỉ số ít tương tự booklet) đều theo dõi trạng thái mong muốn nhưng ở cấp độ khác nhau, api server ở cấp độ cluster, còn kubelet ở cấp độ node nó phụ trách.

**21)** Thực tế có nhiều master node để  dễ scale

## Công cụ và Triển khai

**22)** Minicube cung cấp môi trường kubenetes, Kubectl cung cấp command

**23)** ClusterID là IP ảo nhưng tĩnh được cấp cho default service khi tạo

**24)** 1 service có nhiều pod, tất cả các pod được round-robin phục vụ chứ k phải 1 chính và nhiều dự phòng.

**25)** Giám sát node = daemonSet

**26)** Node đơn thuần là máy chủ vật lí, là môi trường để container chạy, các pod của 1 service có thể phân tán ở nhiều worker node khác nhau

**27)** Việc các pod chạy trên các node khác nhau hay không phụ thuộc vào rule tự định nghĩa hoặc để K8s tự quyết định

**28)** Replicas là các bản sao của 1 pod

**29)** Ingress thuộc tầng 7 , kube-proxy thuộc tầng 4, ingress điều hướng traffic vào service, kube-proxy điều hướng request tới pod thích hợp

## Tình huống thực tế

**30)** Tình huống thực tế, không thể scale dọc =>> scale ngang =>> thêm worker node và thêm pod cho node2,service là tài nguyên api phục vụ cho việc điều hướng request tới pod thích hợp, namespace mới là thứ quyết định tính isolate

**31)** Pod sập còn sửa được, cluster sập thì sao

**32)** Ingress định tuyến nhưng ingress controller mới là thành phần đại diện làm việc định tuyến

**33)** Persistent Volume (PV) và PersistentClaimVolume(PVC) , PV là ổ đĩa cứng vật lý , PVC là đơn xin cấp không gian lưu trữ.

**34)** Có 4 chiến lược deploy, RollingUpdate, Recreate, Blue-Green, Canary

**35)** Có 4 lợi ích : Scalable(thêm node) , HA(có thể  fixed số pod, or thay đổi min or max số pod theo 1 tiêu chí nào đó(ví dụ RAM)), 
