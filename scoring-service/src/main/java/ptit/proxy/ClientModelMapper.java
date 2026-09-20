package ptit.proxy;

import com.hollow.grpc.ModelData;
import com.hollow.grpc.QuestionData;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.NullValueCheckStrategy;
import ptit.entity.Model;
import ptit.entity.Question;

import java.util.List;

@Mapper(
        componentModel = "spring",
        nullValueCheckStrategy = NullValueCheckStrategy.ALWAYS
)
public interface ClientModelMapper {

    // Map một danh sách Proto ModelData -> Danh sách ModelDto của Client
    List<Model> toDtoList(List<ModelData> grpcModels);

    // Map câu hỏi: MapStruct tự động khớp các trường trùng tên (id, questionCode, questionName...)
    Question toQuestionDto(QuestionData grpcQuestion);

    // Map từng ModelData
    // Trường repeated questions trong Proto khi compile sang Java sinh ra getQuestionsList()
    // MapStruct sẽ tự động gọi getQuestionsList() để map sang List<QuestionDto>
    @Mapping(source = "questionsList", target = "questions")
    Model toModelDto(ModelData grpcModel);

}
