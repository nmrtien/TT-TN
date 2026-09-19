package ptit.proxy;

import com.hollow.grpc.ModelData;
import com.hollow.grpc.QuestionData;
import org.mapstruct.CollectionMappingStrategy;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.NullValueCheckStrategy;
import ptit.entity.Model;
import ptit.entity.Question;

import java.util.List;

@Mapper(
        componentModel = "spring",
        collectionMappingStrategy = CollectionMappingStrategy.ADDER_PREFERRED,
        nullValueCheckStrategy = NullValueCheckStrategy.ALWAYS
)
public interface GrpcModelMapper {

    List<ModelData> toGrpcModelList(List<Model> models);

    @Mapping(source = "questions", target = "questionsList")
    ModelData toGrpcModel(Model model);

    QuestionData toGrpcQuestion(Question question);
}
